import {
  Document,
  Footer as DocxFooter,
  Header as DocxHeader,
  Paragraph,
  Table,
  TextRun,
  AlignmentType,
  PageNumber,
  ImageRun,
  HorizontalPositionAlign,
  HorizontalPositionRelativeFrom,
  TextWrappingType,
  VerticalPositionAlign,
  VerticalPositionRelativeFrom,
} from "docx";

export type MitigationDocxContent = Array<Paragraph | Table>;

function normalizePngDataUrl(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex === -1) {
    throw new Error("Draft watermark PNG data is not a data URL");
  }

  const encoded = dataUrl.slice(commaIndex + 1);
  const binary = atob(encoded);
  const source = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const pngSignatureLength = 8;
  let offset = pngSignatureLength;
  let lastImageDataEnd = 0;

  while (offset + 12 <= source.length) {
    const length =
      (source[offset] << 24) |
      (source[offset + 1] << 16) |
      (source[offset + 2] << 8) |
      source[offset + 3];
    const chunkEnd = offset + 12 + length;
    if (chunkEnd > source.length) break;

    const type = String.fromCharCode(
      source[offset + 4],
      source[offset + 5],
      source[offset + 6],
      source[offset + 7],
    );
    if (type === "IDAT") {
      lastImageDataEnd = chunkEnd;
    }
    if (type === "IEND" && chunkEnd === source.length) {
      return dataUrl;
    }

    offset = chunkEnd;
  }

  if (lastImageDataEnd === 0) {
    throw new Error("Draft watermark PNG data does not contain a complete IDAT chunk");
  }

  const iend = Uint8Array.from([
    0x00, 0x00, 0x00, 0x00,
    0x49, 0x45, 0x4e, 0x44,
    0xae, 0x42, 0x60, 0x82,
  ]);
  const repaired = new Uint8Array(lastImageDataEnd + iend.length);
  repaired.set(source.subarray(0, lastImageDataEnd));
  repaired.set(iend, lastImageDataEnd);

  let repairedBinary = "";
  for (let index = 0; index < repaired.length; index += 0x8000) {
    repairedBinary += String.fromCharCode(...repaired.subarray(index, index + 0x8000));
  }

  return `${dataUrl.slice(0, commaIndex + 1)}${btoa(repairedBinary)}`;
}

const DRAFT_WATERMARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="816" height="1056" viewBox="0 0 816 1056"><text x="408" y="528" text-anchor="middle" dominant-baseline="middle" transform="rotate(-35 408 528)" font-family="Arial, Helvetica, sans-serif" font-size="128" font-weight="900" letter-spacing="15" fill="#000000" fill-opacity="0.045">DRAFT</text></svg>`;
const DRAFT_WATERMARK_PNG_SOURCE =
  "data:image/png;base64,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";

function createDraftWatermark(): ImageRun {
  return new ImageRun({
    type: "svg",
    data: `data:image/svg+xml;base64,${btoa(DRAFT_WATERMARK_SVG)}`,
    fallback: {
      type: "png",
      data: normalizePngDataUrl(DRAFT_WATERMARK_PNG_SOURCE),
    },
    transformation: { width: 816, height: 1056 },
    floating: {
      horizontalPosition: {
        relative: HorizontalPositionRelativeFrom.PAGE,
        align: HorizontalPositionAlign.CENTER,
      },
      verticalPosition: {
        relative: VerticalPositionRelativeFrom.PAGE,
        align: VerticalPositionAlign.CENTER,
      },
      behindDocument: true,
      allowOverlap: true,
      lockAnchor: true,
      layoutInCell: true,
      wrap: { type: TextWrappingType.NONE },
      zIndex: 0,
    },
    altText: {
      name: "Draft watermark",
      title: "Draft watermark",
      description: "Diagonal DRAFT watermark indicating this document requires review.",
    },
  });
}

function createDraftWatermarkHeader(): DocxHeader {
  return new DocxHeader({
    children: [
      new Paragraph({
        children: [createDraftWatermark()],
      }),
    ],
  });
}

function createPageNumberFooter(): DocxFooter {
  const footerTextRun = {
    font: "Arial",
    size: 18,
    color: "666666",
  };

  return new DocxFooter({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [
          new TextRun({ text: "Page ", ...footerTextRun }),
          new TextRun({ children: [PageNumber.CURRENT], ...footerTextRun }),
          new TextRun({ text: " of ", ...footerTextRun }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], ...footerTextRun }),
        ],
      }),
    ],
  });
}

function createDraftDocument(title: string, children: MitigationDocxContent) {
  return new Document({
    creator: "OpenDefender Advocate Hub",
    title,
    sections: [
      {
        properties: {
          page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
        },
        headers: { default: createDraftWatermarkHeader() },
        footers: { default: createPageNumberFooter() },
        children,
      },
    ],
  });
}

export function createMitigationDraftDocument(children: MitigationDocxContent) {
  return createDraftDocument("Mitigation Summary — Draft", children);
}

export function createAiPolishedMitigationDraftDocument(children: MitigationDocxContent) {
  return createDraftDocument("AI-Polished Mitigation Draft", children);
}