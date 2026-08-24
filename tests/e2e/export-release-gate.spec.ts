import { inflateRawSync } from "node:zlib";
import { expect, test } from "@playwright/test";

async function readDownload(download: Awaited<ReturnType<import("@playwright/test").Download["createReadStream"]>>) {
  if (!download) throw new Error("Download stream was not available");

  const chunks: Buffer[] = [];
  for await (const chunk of download) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks);
}

function extractDocxDocumentXml(contents: Buffer): string {
  const localFileHeaderSignature = 0x04034b50;
  let offset = 0;

  while (offset + 30 <= contents.length) {
    const signature = contents.readUInt32LE(offset);
    if (signature !== localFileHeaderSignature) break;

    const compressionMethod = contents.readUInt16LE(offset + 8);
    const compressedSize = contents.readUInt32LE(offset + 18);
    const fileNameLength = contents.readUInt16LE(offset + 26);
    const extraFieldLength = contents.readUInt16LE(offset + 28);
    const fileNameStart = offset + 30;
    const fileName = contents.toString("utf8", fileNameStart, fileNameStart + fileNameLength);
    const dataStart = fileNameStart + fileNameLength + extraFieldLength;
    const dataEnd = dataStart + compressedSize;

    if (fileName === "word/document.xml") {
      const compressedData = contents.subarray(dataStart, dataEnd);
      if (compressionMethod === 0) return compressedData.toString("utf8");
      if (compressionMethod === 8) return inflateRawSync(compressedData).toString("utf8");
      throw new Error(`Unsupported ZIP compression method: ${compressionMethod}`);
    }

    offset = dataEnd;
  }

  throw new Error("DOCX archive did not contain word/document.xml");
}

test.describe("browser export release gate", () => {
  test("creates a DOCX draft and opens the printable PDF view", async ({ page }) => {
    await page.addInitScript(() => {
      const releaseWindow = window as Window & {
        __releaseGatePrintCalls?: number;
        __releaseGatePrintDocument?: string;
      };
      releaseWindow.__releaseGatePrintCalls = 0;
      releaseWindow.__releaseGatePrintDocument = "";

      window.open = () =>
        ({
          document: {
            open: () => undefined,
            write: (markup: string) => {
              releaseWindow.__releaseGatePrintDocument = markup;
            },
            close: () => undefined,
          },
          print: () => {
            const releaseWindow = window as Window & { __releaseGatePrintCalls?: number };
            releaseWindow.__releaseGatePrintCalls = (releaseWindow.__releaseGatePrintCalls ?? 0) + 1;
          },
        }) as unknown as Window;
    });

    await page.route("**/api/captcha/config", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ required: false, siteKey: null }),
      });
    });
    await page.route("**/api/mitigation/polish", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          polishedText: "The advocate reports twelve years in the community.",
        }),
      });
    });

    await page.goto("/for-advocates/mitigation-builder");
    await page.getByLabel("Client name or identifier").fill("Release Gate Test");
    const caseNumber = "2024-CR-00512/A (Superior Court) #LONG-CASE-0000000000000000";
    expect(caseNumber).toHaveLength(60);
    await page.getByPlaceholder("e.g. 2024-CR-00512").fill(caseNumber);
    await page.getByPlaceholder("e.g. Bail hearing, diversion application, sentencing memo").fill("Bail hearing");
    await page.getByLabel("Time in community").fill("12 years in the community");
    await expect(page.getByText("Summary output")).toBeVisible();

    const structuredDownloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: ".docx", exact: true }).click();
    const structuredDownload = await structuredDownloadPromise;
    expect(structuredDownload.suggestedFilename()).toBe("mitigation-summary-draft.docx");
    const structuredDocxContents = await readDownload(await structuredDownload.createReadStream());
    expect(structuredDocxContents.subarray(0, 2).toString()).toBe("PK");
    expect(structuredDocxContents.length).toBeGreaterThan(100);
    const structuredDocumentXml = extractDocxDocumentXml(structuredDocxContents);
    expect(structuredDocumentXml).toContain(caseNumber);
    expect(structuredDocumentXml).toContain("Release Gate Test");
    expect(structuredDocumentXml).toContain("Bail hearing");

    await page.getByRole("button", {
      name: "Print or save as PDF: opens browser print dialog",
    }).click();
    await expect
      .poll(() =>
        page.evaluate(
          () => (window as Window & { __releaseGatePrintCalls?: number }).__releaseGatePrintCalls ?? 0,
        ),
      )
      .toBe(1);
    const structuredPrintDocument = await page.evaluate(
      () => (window as Window & { __releaseGatePrintDocument?: string }).__releaseGatePrintDocument ?? "",
    );
    expect(structuredPrintDocument).toContain(`>${caseNumber}<`);
    expect(structuredPrintDocument).toContain(">Release Gate Test<");
    expect(structuredPrintDocument).toContain(">Bail hearing<");
    expect(structuredPrintDocument).toContain("grid-template-columns: max-content minmax(0, 1fr)");
    expect(structuredPrintDocument).toContain("overflow-wrap: anywhere");

    await page.getByRole("button", { name: "Generate narrative", exact: true }).click();
    await expect(page.getByRole("checkbox")).toBeVisible();
    await page.getByRole("checkbox").check();

    const polishedDownloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download .docx", exact: true }).click();
    const polishedDownload = await polishedDownloadPromise;
    expect(polishedDownload.suggestedFilename()).toBe("mitigation-polished-draft-release-gate-test.docx");
    const polishedDocxContents = await readDownload(await polishedDownload.createReadStream());
    expect(polishedDocxContents.subarray(0, 2).toString()).toBe("PK");
    expect(polishedDocxContents.length).toBeGreaterThan(100);
    const polishedDocumentXml = extractDocxDocumentXml(polishedDocxContents);
    expect(polishedDocumentXml).toContain(caseNumber);
    expect(polishedDocumentXml).toContain("Release Gate Test");
    expect(polishedDocumentXml).toContain("Bail hearing");

    await page.getByRole("button", {
      name: "Print or save as PDF: opens browser print dialog",
    }).click();

    await expect
      .poll(() =>
        page.evaluate(
          () => (window as Window & { __releaseGatePrintCalls?: number }).__releaseGatePrintCalls ?? 0,
        ),
      )
      .toBe(1);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (window as Window & { __releaseGatePrintDocument?: string })
              .__releaseGatePrintDocument ?? "",
        ),
      )
      .toContain("Sentencing Mitigation Memorandum");
    const printDocument = await page.evaluate(
      () => (window as Window & { __releaseGatePrintDocument?: string }).__releaseGatePrintDocument ?? "",
    );
    expect(printDocument).toContain(`>${caseNumber}<`);
    expect(printDocument).toContain(">Release Gate Test<");
    expect(printDocument).toContain(">Bail hearing<");
    expect(printDocument).toContain("grid-template-columns: max-content minmax(0, 1fr)");
    expect(printDocument).toContain("overflow-wrap: anywhere");
  });
});