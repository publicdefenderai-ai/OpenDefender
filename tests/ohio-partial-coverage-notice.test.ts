import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import en from "../client/src/locales/en";
import es from "../client/src/locales/es";
import zh from "../client/src/locales/zh";

const qaFlowSource = readFileSync("client/src/components/legal/qa-flow.tsx", "utf8");
const chargeSelectorSource = readFileSync("client/src/components/chat/charge-selector.tsx", "utf8");

const localeNotices = [
  {
    language: "English",
    qa: en.translation.legalGuidance.qaFlow.caseDetails.ohioCoverageNotice,
    chat: en.translation.chat.chargeSelector.ohioCoverageNotice,
    expected: "Ohio’s charge list is still being populated",
  },
  {
    language: "Spanish",
    qa: es.translation.legalGuidance.qaFlow.caseDetails.ohioCoverageNotice,
    chat: es.translation.chat.chargeSelector.ohioCoverageNotice,
    expected: "La lista de cargos de Ohio todavía se está completando",
  },
  {
    language: "Chinese",
    qa: zh.translation.legalGuidance.qaFlow.caseDetails.ohioCoverageNotice,
    chat: zh.translation.chat.chargeSelector.ohioCoverageNotice,
    expected: "俄亥俄州的指控列表仍在补充中",
  },
];

describe("Ohio partial charge coverage notice", () => {
  it("has equivalent, translated notice text in all locales and both selectors", () => {
    for (const { language, qa, chat, expected } of localeNotices) {
      expect(qa, `${language} QA notice`).toBeTruthy();
      expect(chat, `${language} chat notice`).toBe(qa);
      expect(qa, `${language} translation`).toContain(expected);
      expect(qa, `${language} notice should not claim complete verification`).not.toMatch(
        /\b(?:all|verified|verified\s+all)\b|\d+/i,
      );
    }
  });

  it("renders the notice only for Ohio and keeps Ohio on the authority-backed path", () => {
    expect(qaFlowSource).toContain('formData.jurisdiction?.toUpperCase() === "OH"');
    expect(chargeSelectorSource).toContain('jurisdiction.toUpperCase() === "OH"');
    expect(qaFlowSource).toContain('role="note"');
    expect(chargeSelectorSource).toContain('role="note"');
    expect(qaFlowSource).toContain('data-testid="ohio-partial-coverage-notice"');
    expect(chargeSelectorSource).toContain('data-testid="ohio-partial-coverage-notice"');
    expect(chargeSelectorSource).toContain(
      '["NY", "TX", "FL", "PA", "SC", "OH"].includes(jurisdiction.toUpperCase())',
    );
  });
});