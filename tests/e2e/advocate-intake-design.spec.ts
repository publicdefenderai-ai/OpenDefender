import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import JSZip from "jszip";

for (const language of ["en", "es", "zh"]) {
  for (const theme of ["light", "dark"]) {
    test(`first contact checklist in ${language}, ${theme}`, async ({ page, context }) => {
      await page.setViewportSize({ width: theme === "dark" ? 320 : 1280, height: 900 });
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
      }, { language, theme });
      await page.goto("/for-advocates/intake-checklist");
      const form = page.locator(".intake-workspace");
      await expect(form).toHaveAttribute("lang", "en");
      const status = form.getByRole("status");
      const record = form.locator("#intake-record");
      await expect(record.getByRole("button", { name: "Copy" })).toBeDisabled();
      const domains = form.locator(".intake-toggle");
      await expect(domains).toHaveCount(7);
      for (const domain of await domains.all()) {
        if (await domain.getAttribute("aria-expanded") === "false") {
          await domain.focus();
          await page.keyboard.press("Enter");
        }
      }
      const groups = form.getByRole("group");
      await expect(groups).toHaveCount(19);
      for (const group of await groups.all()) {
        const yes = group.getByRole("button", { name: "Yes", exact: true });
        await yes.click();
        await expect(yes).toHaveAttribute("aria-pressed", "true");
      }
      const fields = form.getByRole("textbox");
      await expect(fields).toHaveCount(7);
      for (const field of await fields.all()) {
        await expect(field).toHaveAccessibleName(/.+/);
        await field.fill("Example & <record>");
      }
      for (const box of await form.getByRole("checkbox").all()) await box.check();
      await expect(status).toHaveText("7 sections · 32 fields filled");
      const citizen = form.getByRole("group", { name: "U.S. citizen?", exact: true });
      await citizen.getByRole("button", { name: "Unknown" }).click();
      await expect(record.locator("pre")).toContainText("U.S. citizen: unknown");
      await citizen.getByRole("button", { name: "Unknown" }).click();
      await expect(record.locator("pre")).not.toContainText("U.S. citizen:");
      await form.getByRole("link", { name: "View intake record" }).click();
      await expect(record).toBeFocused();
      await expect(record.getByRole("heading")).toBeInViewport();
      expect(await form.evaluate(node => [...node.querySelectorAll("input, button, pre")].some(el => el.getBoundingClientRect().right > innerWidth + 1))).toBe(false);

      if (language === "en" && theme === "light") {
        const draft = await record.locator("pre").innerText();
        await context.grantPermissions(["clipboard-read", "clipboard-write"]);
        await record.getByRole("button", { name: "Copy" }).click();
        expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(draft);
        for (const format of [".txt", ".docx"]) {
          const pending = page.waitForEvent("download");
          await record.getByRole("button", { name: format }).click();
          const file = await pending;
          const data = await readFile((await file.path())!);
          if (format === ".txt") expect(data.toString()).toBe(draft);
          else {
            const xml = await (await JSZip.loadAsync(data)).file("word/document.xml")!.async("string");
            expect(xml).toContain("Example &amp; &lt;record&gt;");
            expect(xml).toContain("DOCUMENTS TO OBTAIN");
          }
        }
        const popup = page.waitForEvent("popup");
        await record.getByRole("button", { name: "Print / PDF" }).click();
        const print = await popup;
        await expect(print.locator("pre")).toHaveText(draft);
        await print.close();
      }
      await page.reload();
      await expect(status).toHaveText("7 sections · 0 fields filled");
    });
  }
}
