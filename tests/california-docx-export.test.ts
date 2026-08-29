import { inflateRawSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { getChargeById, getVerifiedCitation, getVerifiedSourceUrl } from "../shared/criminal-charges";
import type { GeneratedDocument } from "../server/services/attorney-docs/document-generator";
import { generateDocx } from "../server/services/attorney-docs/docx-generator";

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

function makeExportDocument(): GeneratedDocument {
  const chargeIds = [
    "ca-gross-vehicular-manslaughter-191-5-a",
    "ca-grand-theft-agricultural-487-b1a",
  ];
  const chargeLines = chargeIds.map((id) => {
    const charge = getChargeById(id)!;
    const citation = getVerifiedCitation(charge)!;
    const sourceUrl = getVerifiedSourceUrl(charge)!;
    return `${charge.name}: ${citation}; Source: ${sourceUrl}`;
  });

  return {
    documentId: "california-export-test",
    sessionId: "california-export-session",
    templateId: "california-charge-export-test",
    templateName: "California Charge Export Test",
    jurisdiction: "CA",
    courtType: "state",
    sections: [{
      id: "charges",
      name: "Understanding Your Charges",
      type: "static",
      content: chargeLines.join("\n"),
    }],
    generatedAt: new Date("2026-08-29T00:00:00.000Z"),
    expiresAt: new Date("2026-08-30T00:00:00.000Z"),
  };
}

describe("California exact subdivision DOCX export", () => {
  it("retains canonical names, citations, and source links in word/document.xml", async () => {
    const contents = await generateDocx(makeExportDocument(), {});
    const documentXml = extractDocxEntry(contents, "word/document.xml").toString("utf8");

    expect(contents.subarray(0, 2).toString()).toBe("PK");
    expect(documentXml).toContain("Gross Vehicular Manslaughter While Intoxicated");
    expect(documentXml).toContain("Cal. Penal Code § 191.5(a)");
    expect(documentXml).toContain("sectionNum=191.5&amp;lawCode=PEN");
    expect(documentXml).toContain("Grand Theft of Specified Agricultural Crops");
    expect(documentXml).toContain("Cal. Penal Code § 487(b)(1)(A)");
    expect(documentXml).toContain("sectionNum=487&amp;lawCode=PEN");
    expect(documentXml).not.toContain("Vehicular Homicide");
    expect(documentXml).not.toContain("Grand Theft in the First Degree");
  });
});