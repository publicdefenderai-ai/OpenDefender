import { expect, test } from "@playwright/test";

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

    await page.goto("/for-advocates/mitigation-builder");
    await page.getByLabel("Client name or identifier").fill("Release Gate Test");
    await page.getByLabel("Time in community").fill("12 years in the community");
    await expect(page.getByText("Summary output")).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: ".docx", exact: true }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("mitigation-summary-draft.docx");
    const docxStream = await download.createReadStream();
    const docxChunks: Buffer[] = [];
    for await (const chunk of docxStream) docxChunks.push(chunk);
    const docxContents = Buffer.concat(docxChunks);
    expect(docxContents.subarray(0, 2).toString()).toBe("PK");
    expect(docxContents.length).toBeGreaterThan(100);

    await page.getByRole("button", {
      name: "Print or save as PDF — opens browser print dialog",
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
  });
});