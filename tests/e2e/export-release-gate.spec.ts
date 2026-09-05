import { inflateRawSync } from "node:zlib";
import { expect, test } from "@playwright/test";

async function readDownload(download: Awaited<ReturnType<import("@playwright/test").Download["createReadStream"]>>) {
  if (!download) throw new Error("Download stream was not available");

  const chunks: Buffer[] = [];
  for await (const chunk of download) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks);
}

function extractDocxEntry(contents: Buffer, entryName: string): Buffer {
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

function extractDocxXml(contents: Buffer, entryName: string): string {
  return extractDocxEntry(contents, entryName).toString("utf8");
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
    let polishRequestCount = 0;
    await page.route("**/api/mitigation/polish", async (route) => {
      polishRequestCount += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          polishedText: "The advocate reports twelve years in the community.",
        }),
      });
    });

    await page.clock.install();
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
    const structuredDocumentXml = extractDocxXml(structuredDocxContents, "word/document.xml");
    const structuredHeaderXml = extractDocxXml(structuredDocxContents, "word/header1.xml");
    const structuredFooterXml = extractDocxXml(structuredDocxContents, "word/footer1.xml");
    expect(structuredDocumentXml).toContain(caseNumber);
    expect(structuredDocumentXml).toContain("Release Gate Test");
    expect(structuredDocumentXml).toContain("Bail hearing");
    expect(structuredDocumentXml).toContain("DRAFT");
    expect(structuredHeaderXml).toContain("Diagonal DRAFT watermark");
    expect(structuredHeaderXml).toContain('behindDoc="1"');
    expect(structuredFooterXml).toContain("PAGE");
    expect(structuredFooterXml).toContain("NUMPAGES");

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
    expect(structuredPrintDocument).toContain('content: "DRAFT";');
    expect(structuredPrintDocument).toContain('content: "Page " counter(page) " of " counter(pages);');

    const polishButton = page.getByRole("button", { name: "Generate narrative", exact: true });
    await polishButton.click();
    await expect.poll(() => polishRequestCount).toBe(1);
    await expect(polishButton).toBeHidden();
    const cooldownButton = page.getByRole("button", { name: /Regenerate in \d+s…/ });
    await expect(cooldownButton).toBeVisible();
    await expect(cooldownButton).toBeDisabled();
    await page.getByLabel("Time in community").fill("12 years in the community, updated");
    await expect(page.getByRole("button", { name: /Regenerate in \d+s…/ })).toBeDisabled();
    expect(polishRequestCount).toBe(1);
    await page.clock.runFor(30_000);
    await expect(page.getByRole("button", { name: "Regenerate", exact: true })).toBeEnabled();
    await expect(page.getByRole("checkbox")).toBeVisible();
    await page.getByRole("checkbox").check();

    const polishedDownloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download .docx", exact: true }).click();
    const polishedDownload = await polishedDownloadPromise;
    expect(polishedDownload.suggestedFilename()).toBe("mitigation-polished-draft-release-gate-test.docx");
    const polishedDocxContents = await readDownload(await polishedDownload.createReadStream());
    expect(polishedDocxContents.subarray(0, 2).toString()).toBe("PK");
    expect(polishedDocxContents.length).toBeGreaterThan(100);
    const polishedDocumentXml = extractDocxXml(polishedDocxContents, "word/document.xml");
    const polishedHeaderXml = extractDocxXml(polishedDocxContents, "word/header1.xml");
    const polishedFooterXml = extractDocxXml(polishedDocxContents, "word/footer1.xml");
    expect(polishedDocumentXml).toContain(caseNumber);
    expect(polishedDocumentXml).toContain("Release Gate Test");
    expect(polishedDocumentXml).toContain("Bail hearing");
    expect(polishedDocumentXml).toContain("AI-POLISHED DRAFT");
    expect(polishedHeaderXml).toContain("Diagonal DRAFT watermark");
    expect(polishedHeaderXml).toContain('behindDoc="1"');
    expect(polishedFooterXml).toContain("PAGE");
    expect(polishedFooterXml).toContain("NUMPAGES");

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
    expect(printDocument).toContain('content: "DRAFT";');
    expect(printDocument).toContain('content: "Page " counter(page) " of " counter(pages);');
  });

  test("throttles failed AI polish requests until the filled-field count changes", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.route("**/api/captcha/config", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ required: false, siteKey: null }),
      });
    });
    let polishRequestCount = 0;
    await page.route("**/api/mitigation/polish", async (route) => {
      polishRequestCount += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: "Release gate polish failure",
        }),
      });
    });

    await page.clock.install();
    await page.goto("/for-advocates/mitigation-builder");
    await page.getByLabel("Client name or identifier").fill("Failed Polish Release Gate Test");
    await page
      .getByPlaceholder("e.g. Bail hearing, diversion application, sentencing memo")
      .fill("Bail hearing");
    await page.getByLabel("Time in community").fill("12 years in the community");
    await expect(page.getByText("Summary output")).toBeVisible();
    const consoleErrorsBeforePolish = consoleErrors.length;

    const polishButton = page.getByRole("button", { name: "Generate narrative", exact: true });
    await polishButton.click();
    await expect.poll(() => polishRequestCount).toBe(1);
    await expect(page.getByText("Release gate polish failure")).toBeVisible();

    const cooldownButton = page.getByRole("button", { name: /Regenerate in \d+s…/ });
    await expect(cooldownButton).toBeVisible();
    await expect(cooldownButton).toBeDisabled();
    await expect(cooldownButton).toContainText("30s");

    await page.getByPlaceholder("e.g. Mother, two siblings, spouse").fill("Mother and spouse");
    await expect(page.getByRole("button", { name: "Regenerate", exact: true })).toBeEnabled();
    expect(polishRequestCount).toBe(1);
    expect(consoleErrors.slice(consoleErrorsBeforePolish)).toEqual([]);
  });

  test("throttles network-failed AI polish requests until the filled-field count changes", async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error));

    await page.route("**/api/captcha/config", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ required: false, siteKey: null }),
      });
    });
    let polishRequestCount = 0;
    await page.route("**/api/mitigation/polish", async (route) => {
      polishRequestCount += 1;
      await route.abort("failed");
    });

    await page.clock.install();
    await page.goto("/for-advocates/mitigation-builder");
    await page.getByLabel("Client name or identifier").fill("Network Failed Polish Release Gate Test");
    await page
      .getByPlaceholder("e.g. Bail hearing, diversion application, sentencing memo")
      .fill("Bail hearing");
    await page.getByLabel("Time in community").fill("12 years in the community");
    await expect(page.getByText("Summary output")).toBeVisible();
    const consoleErrorsBeforePolish = consoleErrors.length;

    const polishButton = page.getByRole("button", { name: "Generate narrative", exact: true });
    await polishButton.click();
    await expect.poll(() => polishRequestCount).toBe(1);
    await expect(page.getByText("Network error. Please try again.")).toBeVisible();

    const cooldownButton = page.getByRole("button", { name: /Regenerate in \d+s…/ });
    await expect(cooldownButton).toBeVisible();
    await expect(cooldownButton).toBeDisabled();
    await expect(cooldownButton).toContainText("30s");

    await page.getByPlaceholder("e.g. Mother, two siblings, spouse").fill("Mother and spouse");
    await expect(page.getByRole("button", { name: "Regenerate", exact: true })).toBeEnabled();
    expect(polishRequestCount).toBe(1);
    expect(consoleErrors.slice(consoleErrorsBeforePolish)).toEqual(["Failed to load resource: net::ERR_FAILED"]);
    expect(pageErrors).toEqual([]);
  });

  test("synchronizes AI polish cooldowns across open builder tabs", async ({ context }) => {
    const page = await context.newPage();
    const secondPage = await context.newPage();
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    for (const currentPage of [page, secondPage]) {
      currentPage.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      currentPage.on("pageerror", (error) => pageErrors.push(error));
    }

    await context.route("**/api/attorney/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ isVerified: false }),
      });
    });
    await context.route("**/api/captcha/config", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ required: false, siteKey: null }),
      });
    });
    let polishRequestCount = 0;
    await context.route("**/api/mitigation/polish", async (route) => {
      polishRequestCount += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: "Cross-tab release gate polish failure",
        }),
      });
    });

    await Promise.all([page.clock.install(), secondPage.clock.install()]);
    await Promise.all([
      page.goto("/for-advocates/mitigation-builder"),
      secondPage.goto("/for-advocates/mitigation-builder"),
    ]);

    for (const currentPage of [page, secondPage]) {
      await currentPage.getByLabel("Client name or identifier").fill("Cross-tab Polish Release Gate Test");
      await currentPage
        .getByPlaceholder("e.g. Bail hearing, diversion application, sentencing memo")
        .fill("Bail hearing");
      await currentPage.getByLabel("Time in community").fill("12 years in the community");
      await expect(currentPage.getByText("Summary output")).toBeVisible();
    }

    await page.getByRole("button", { name: "Generate narrative", exact: true }).click();
    await expect.poll(() => polishRequestCount).toBe(1);
    await expect(
      secondPage.getByRole("button", { name: /(?:Generate narrative|Regenerate) in \d+s…/ }),
    ).toBeDisabled();

    await page.clock.fastForward(30_000);
    await expect(page.getByRole("button", { name: "Regenerate", exact: true })).toBeEnabled();
    await expect(secondPage.getByRole("button", { name: "Generate narrative", exact: true })).toBeEnabled();

    await page.getByRole("button", { name: "Regenerate", exact: true }).click();
    await expect.poll(() => polishRequestCount).toBe(2);
    await expect(
      secondPage.getByRole("button", { name: /(?:Generate narrative|Regenerate) in \d+s…/ }),
    ).toBeDisabled();

    await secondPage.getByPlaceholder("e.g. Mother, two siblings, spouse").fill("Mother and spouse");
    await expect(secondPage.getByRole("button", { name: "Generate narrative", exact: true })).toBeEnabled();
    await expect(page.getByRole("button", { name: "Regenerate", exact: true })).toBeEnabled();
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });
});