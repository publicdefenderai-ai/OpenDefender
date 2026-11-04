import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import en from "../client/src/locales/en";
import es from "../client/src/locales/es";
import zh from "../client/src/locales/zh";

describe("Florida partial charge coverage notice", () => {
  it.each([
    ["English", en, "Florida’s charge list is still being populated", "do not select a different offense as a substitute"],
    ["Spanish", es, "La lista de cargos de Florida todavía se está completando", "no seleccione otro delito como sustituto"],
    ["Chinese", zh, "佛罗里达州的指控列表仍在补充中", "请勿选择其他罪名代替"],
  ] as const)("keeps the %s warning equivalent in both charge selectors", (_language, locale, opening, instruction) => {
    const qa = locale.translation.legalGuidance.qaFlow.caseDetails.floridaCoverageNotice;
    const chat = locale.translation.chat.chargeSelector.floridaCoverageNotice;
    expect(qa).toContain(opening);
    expect(qa).toContain(instruction);
    expect(chat).toBe(qa);
  });

  it.each([
    ["client/src/components/chat/charge-selector.tsx", 'jurisdiction.toUpperCase() === "FL"', "chat.chargeSelector"],
    ["client/src/components/legal/qa-flow.tsx", 'formData.jurisdiction?.toUpperCase() === "FL"', "legalGuidance.qaFlow.caseDetails"],
  ])("scopes the warning to Florida in %s without replacing Ohio's notice", (path, condition, prefix) => {
    const source = readFileSync(path, "utf8");
    expect(source).toContain(`const isFlorida = ${condition}`);
    expect(source).toMatch(/\{isFlorida && \([\s\S]*?role="note"[\s\S]*?data-testid="florida-partial-coverage-notice"/);
    expect(source).toContain(`t('${prefix}.floridaCoverageNotice')`);
    expect(source).toContain('data-testid="ohio-partial-coverage-notice"');
    expect(source).toContain(`t('${prefix}.ohioCoverageNotice')`);
  });
});
