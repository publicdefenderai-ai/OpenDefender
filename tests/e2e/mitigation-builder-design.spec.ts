import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"]) {
  test(`Mitigation Builder intake and summary navigation in ${theme}`, async ({ page }) => {
    await page.addInitScript(theme => {
      localStorage.setItem("public-defender-theme", theme);
      localStorage.setItem("i18nextLng", "es");
    }, theme);
    await page.setViewportSize({ width: theme === "dark" ? 320 : 1280, height: 900 });
    await page.goto("/for-advocates/mitigation-builder");
    const builder = page.locator(".mitigation-workspace");
    await expect(builder).toHaveAttribute("lang", "en");
    await expect(builder).toContainText("not automatically privileged");
    await expect(builder).toContainText("sends the information you entered for AI processing");
    const progress = builder.getByRole("status").first();
    await expect(progress).toContainText("0 of 22");
    await expect(builder.locator(".mitigation-toggle")).toHaveCount(7);
    for (const section of await builder.locator(".mitigation-toggle").all()) {
      if (await section.getAttribute("aria-expanded") === "true") continue;
      await section.focus();
      await page.keyboard.press("Enter");
      await expect(section).toHaveAttribute("aria-expanded", "true");
    }
    const fields = builder.locator(".mitigation-fields input, .mitigation-fields select, .mitigation-fields textarea");
    await expect(fields).toHaveCount(22);
    for (const field of await fields.all()) {
      await expect(field).toHaveAccessibleName(/.+/);
      if (await field.evaluate(el => el.tagName === "SELECT")) await field.selectOption({ index: 1 });
      else await field.fill("Example intake");
    }
    await expect(progress).toContainText("22 of 22");
    const clipped = await fields.evaluateAll(nodes => nodes.filter(node => {
      const rect = node.getBoundingClientRect();
      return rect.left < -1 || rect.right > innerWidth + 1;
    }).map(node => node.id));
    expect(clipped).toEqual([]);
    await builder.getByRole("link", { name: "View structured summary" }).click();
    await expect(builder.getByRole("heading", { name: "Summary output" })).toBeInViewport();
    await expect(builder.locator("pre")).toContainText("Example intake");
    page.once("dialog", dialog => dialog.dismiss());
    await builder.getByRole("button", { name: "Clear all fields" }).click();
    await expect(progress).toContainText("22 of 22");
    page.once("dialog", dialog => dialog.accept());
    await builder.getByRole("button", { name: "Clear all fields" }).click();
    await expect(progress).toContainText("0 of 22");
    await expect(builder.locator("pre")).toHaveCount(0);
  });
}
