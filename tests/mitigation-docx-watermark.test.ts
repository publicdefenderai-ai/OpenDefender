import { inflateRawSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { Packer, Paragraph, TextRun } from "docx";
import {
  createAiPolishedMitigationDraftDocument,
  createMitigationDraftDocument,
} from "../client/src/lib/mitigation-docx";

function listDocxEntries(contents: Buffer): string[] {
  const entries: string[] = [];
  const localFileHeaderSignature = 0x04034b50;
  let offset = 0;

  while (offset + 30 <= contents.length) {
    if (contents.readUInt32LE(offset) !== localFileHeaderSignature) break;

    const fileNameLength = contents.readUInt16LE(offset + 26);
    const extraFieldLength = contents.readUInt16LE(offset + 28);
    const fileNameStart = offset + 30;
    const fileName = contents.toString("utf8", fileNameStart, fileNameStart + fileNameLength);
    const compressedSize = contents.readUInt32LE(offset + 18);
    const dataStart = fileNameStart + fileNameLength + extraFieldLength;

    entries.push(fileName);
    offset = dataStart + compressedSize;
  }

  return entries;
}

function extractDocxEntry(contents: Buffer, entryName: string): Buffer {
  const localFileHeaderSignature = 0x04034b50;
  let offset = 0;

  while (offset + 30 <= contents.length) {
    if (contents.readUInt32LE(offset) !== localFileHeaderSignature) break;

    const compressionMethod = contents.readUInt16LE(offset + 8);
    const compressedSize = contents.readUInt32LE(offset + 18);
    const fileNameLength = contents.readUInt16LE(offset + 26);
    const extraFieldLength = contents.readUInt16LE(offset + 28);
    const fileNameStart = offset + 30;
    const fileName = contents.toString("utf8", fileNameStart, fileNameStart + fileNameLength);
    const dataStart = fileNameStart + fileNameLength + extraFieldLength;
    const dataEnd = dataStart + compressedSize;

    if (fileName === entryName) {
      const compressedData = contents.subarray(dataStart, dataEnd);
      if (compressionMethod === 0) return compressedData;
      if (compressionMethod === 8) return inflateRawSync(compressedData);
      throw new Error(`Unsupported ZIP compression method: ${compressionMethod}`);
    }

    offset = dataEnd;
  }

  throw new Error(`DOCX archive did not contain ${entryName}`);
}

function fixtureParagraphs(text: string) {
  return [
    new Paragraph({
      children: [new TextRun({ text })],
    }),
  ];
}

describe("mitigation DOCX DRAFT watermark", () => {
  it.each([
    ["standard", createMitigationDraftDocument(fixtureParagraphs("Standard mitigation draft"))],
    [
      "AI-polished",
      createAiPolishedMitigationDraftDocument(fixtureParagraphs("AI-polished mitigation draft")),
    ],
  ])("embeds an anchored behind-content DRAFT watermark in the %s export", async (_variant, document) => {
    const contents = await Packer.toBuffer(document);
    const entries = listDocxEntries(contents);
    const headerXml = extractDocxEntry(contents, "word/header1.xml").toString("utf8");
    const headerRelationshipsXml = extractDocxEntry(contents, "word/_rels/header1.xml.rels").toString("utf8");

    expect(contents.subarray(0, 2).toString()).toBe("PK");
    expect(headerXml).toContain("Diagonal DRAFT watermark");
    expect(headerXml).toMatch(/<wp:anchor\b[^>]*behindDoc="1"/);
    const mediaTargets = [...headerRelationshipsXml.matchAll(/Target="(media\/[^"]+)"/g)].map(
      ([, target]) => `word/${target}`,
    );
    const svgEntry = mediaTargets.find((entry) => entry.endsWith(".svg"));
    const pngEntry = mediaTargets.find((entry) => entry.endsWith(".png"));
    expect(svgEntry).toBeDefined();
    expect(pngEntry).toBeDefined();
    expect(entries).toEqual(expect.arrayContaining(mediaTargets));
    expect(extractDocxEntry(contents, svgEntry!).toString("utf8")).toContain("DRAFT");
    expect(extractDocxEntry(contents, pngEntry!).subarray(0, 8)).toEqual(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
  });
});