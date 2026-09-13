const ZIP_LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;
const PNG_SIGNATURE = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

type DocxContents = Blob | ArrayBuffer | Uint8Array;

const MEDIA_ENTRY_PATTERN = /(?:^|\/)media\/[^/]+$/i;

async function toBytes(contents: DocxContents): Promise<Uint8Array> {
  if (typeof Blob !== "undefined" && contents instanceof Blob) {
    return new Uint8Array(await contents.arrayBuffer());
  }

  if (contents instanceof Uint8Array) {
    return contents;
  }

  if (contents instanceof ArrayBuffer) {
    return new Uint8Array(contents);
  }

  throw new TypeError("Unsupported DOCX contents");
}

function sliceAsArrayBuffer(contents: Uint8Array): ArrayBuffer {
  return contents.buffer.slice(
    contents.byteOffset,
    contents.byteOffset + contents.byteLength,
  ) as ArrayBuffer;
}

async function inflateRaw(contents: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([sliceAsArrayBuffer(contents)])
    .stream()
    .pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function readUint32BigEndian(contents: Uint8Array, offset: number): number {
  return (
    contents[offset] * 0x1000000 +
    contents[offset + 1] * 0x10000 +
    contents[offset + 2] * 0x100 +
    contents[offset + 3]
  );
}

function readUint32LittleEndian(contents: Uint8Array, offset: number): number {
  return (
    contents[offset] +
    contents[offset + 1] * 0x100 +
    contents[offset + 2] * 0x10000 +
    contents[offset + 3] * 0x1000000
  );
}

function crc32(contents: Uint8Array): number {
  let crc = 0xffffffff;

  for (const byte of contents) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function validatePng(contents: Uint8Array): void {
  if (
    contents.length < PNG_SIGNATURE.length ||
    !PNG_SIGNATURE.every((byte, index) => contents[index] === byte)
  ) {
    throw new Error("invalid PNG signature");
  }

  let offset = PNG_SIGNATURE.length;
  let sawHeader = false;
  let sawImageData = false;
  let sawEnd = false;

  while (offset + 12 <= contents.length) {
    const length = readUint32BigEndian(contents, offset);
    const typeStart = offset + 4;
    const dataStart = offset + 8;
    const crcStart = dataStart + length;
    const chunkEnd = crcStart + 4;

    if (chunkEnd > contents.length) {
      throw new Error("truncated PNG chunk");
    }

    const type = String.fromCharCode(
      contents[typeStart],
      contents[typeStart + 1],
      contents[typeStart + 2],
      contents[typeStart + 3],
    );
    const chunkData = contents.subarray(dataStart, crcStart);
    const expectedCrc = readUint32BigEndian(contents, crcStart);
    const actualCrc = crc32(contents.subarray(typeStart, crcStart));

    if (actualCrc !== expectedCrc) {
      throw new Error(`invalid ${type} chunk CRC`);
    }

    if (type === "IHDR") sawHeader = true;
    if (type === "IDAT") sawImageData = true;
    if (type === "IEND") {
      if (length !== 0) throw new Error("PNG IEND chunk is not empty");
      sawEnd = true;
      offset = chunkEnd;
      break;
    }

    offset = chunkEnd;
  }

  if (!sawHeader) throw new Error("PNG is missing an IHDR chunk");
  if (!sawImageData) throw new Error("PNG is missing an IDAT chunk");
  if (!sawEnd) throw new Error("PNG is missing a complete IEND chunk");
  if (offset !== contents.length) throw new Error("PNG has data after IEND");
}

function validateSvg(contents: Uint8Array): void {
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(contents);
  } catch {
    throw new Error("SVG payload is not valid UTF-8");
  }

  const normalized = text.replace(/^\uFEFF/, "").trim();
  if (!/<svg\b[^>]*>/i.test(normalized)) {
    throw new Error("SVG is missing its opening element");
  }
  if (!/<\/svg>\s*$/i.test(normalized)) {
    throw new Error("SVG is missing a complete closing element");
  }
  if (normalized.includes("\u0000")) {
    throw new Error("SVG contains a null byte");
  }

  const withoutComments = normalized
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\?[\s\S]*?\?>/g, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "");
  const tags = /<(\/?)([A-Za-z_][\w:.-]*)([^<>]*)>/g;
  const stack: string[] = [];
  let rootSeen = false;
  let rootClosed = false;
  let match: RegExpExecArray | null;

  while ((match = tags.exec(withoutComments))) {
    const [, closing, name, attributes] = match;
    if (closing) {
      if (stack.pop() !== name) throw new Error("SVG elements are not properly nested");
      if (stack.length === 0) rootClosed = true;
    } else {
      if (rootClosed) throw new Error("SVG contains content after the root element");
      if (!rootSeen && name.toLowerCase() !== "svg") {
        throw new Error("SVG content appears before the root element");
      }
      if (!attributes.trimEnd().endsWith("/")) stack.push(name);
    }
    rootSeen = true;
  }

  if (stack.length !== 0 || !rootClosed) {
    throw new Error("SVG contains an incomplete element");
  }
}

function validateImagePayload(entryName: string, contents: Uint8Array): void {
  const extension = entryName.slice(entryName.lastIndexOf(".") + 1).toLowerCase();

  switch (extension) {
    case "png":
      validatePng(contents);
      break;
    case "svg":
      validateSvg(contents);
      break;
    default:
      throw new Error(`unsupported embedded image format .${extension}`);
  }
}

/**
 * Validate every embedded DOCX image before the file is handed to an editor.
 *
 * The variant is intentionally caller-provided so errors identify the user
 * export that produced the archive, not just the generic DOCX format.
 */
export async function validateDocxImageEntries(
  contents: DocxContents,
  variant: string,
): Promise<void> {
  const bytes = await toBytes(contents);
  let offset = 0;

  while (offset + 30 <= bytes.length) {
    if (readUint32LittleEndian(bytes, offset) !== ZIP_LOCAL_FILE_HEADER_SIGNATURE) break;

    const flags = bytes[offset + 6] + bytes[offset + 7] * 0x100;
    const compressionMethod = bytes[offset + 8] + bytes[offset + 9] * 0x100;
    const compressedSize = readUint32LittleEndian(bytes, offset + 18);
    const fileNameLength = bytes[offset + 26] + bytes[offset + 27] * 0x100;
    const extraFieldLength = bytes[offset + 28] + bytes[offset + 29] * 0x100;
    const fileNameStart = offset + 30;
    const dataStart = fileNameStart + fileNameLength + extraFieldLength;
    const dataEnd = dataStart + compressedSize;
    const entryName = new TextDecoder("utf-8", { fatal: true }).decode(
      bytes.subarray(fileNameStart, fileNameStart + fileNameLength),
    );

    if (MEDIA_ENTRY_PATTERN.test(entryName)) {
      try {
        if (dataStart > bytes.length || dataEnd > bytes.length) {
          throw new Error("truncated ZIP entry");
        }
        if (flags & 0x0008) {
          throw new Error("ZIP data descriptors are not supported for image entries");
        }

        const compressed = bytes.subarray(dataStart, dataEnd);
        let payload: Uint8Array;
        if (compressionMethod === 0) {
          payload = compressed;
        } else if (compressionMethod === 8) {
          payload = await inflateRaw(compressed);
        } else {
          throw new Error(`unsupported ZIP compression method ${compressionMethod}`);
        }
        validateImagePayload(entryName, payload);
      } catch (error) {
        const reason = error instanceof Error ? error.message : "unreadable payload";
        throw new Error(
          `DOCX export "${variant}" contains malformed embedded image "${entryName}": ${reason}`,
          { cause: error },
        );
      }
    } else if (dataStart > bytes.length || dataEnd > bytes.length) {
      throw new Error(`DOCX export "${variant}" contains a truncated ZIP entry`);
    }

    offset = dataEnd;
  }
}