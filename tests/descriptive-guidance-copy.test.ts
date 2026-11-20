import { describe, expect, it } from 'vitest';
import en from '../client/src/locales/en';
import es from '../client/src/locales/es';
import zh from '../client/src/locales/zh';
import { CHARGE_CONSEQUENCE_MAP } from '../server/services/guidance-engine';
import { texasVerifiedInstructions } from '../shared/texas-jury-instructions';

for (const [language, locale] of Object.entries({ en, es, zh })) {
  describe(`${language} information copy`, () => {
    const copy = locale.translation;
    it('keeps all six card bodies and uses descriptive section headings', () => {
      for (const section of ['police','arraignment','bail','pretrial','plea','sentencing'] as const) {
        expect(Object.values(copy.quickRef[section]).every(value => typeof value === 'string' && value.trim().length > 0)).toBe(true);
      }
      expect(copy.quickRef.police.doHeading).not.toMatch(/^(Do|Haga|应该做)$/);
      expect(copy.quickRef.police.dontHeading).not.toMatch(/^(Don't|No Haga|不要做)$/);
      expect(copy.quickRef.arraignment.say).not.toMatch(/What to Say|Qué Decir|该说什么/);
    });
    it('describes general roadmap information rather than a case-law analysis or personal instructions', () => {
      expect(copy.guidance.ohioSavedChargeNotice).not.toMatch(/or continue without a charge|o continuar sin un cargo|或不选择指控继续/);
      expect(copy.case.howItWorks.step2Desc).not.toMatch(/past court cases|casos pasados|过去的判例/);
      expect(copy.case.howItWorks.step3Desc).not.toMatch(/tailored next steps|pasos personalizados|量身定制/);
      expect(copy.legalGuidance.dashboard.uncertaintyDisclosures.dmiHearingVariation).not.toMatch(/10|立即|inmediatamente/);
    });
  });
}
it('keeps DUI administrative action distinct from conviction and does not invent a national hearing deadline', () => {
  const row = CHARGE_CONSEQUENCE_MAP.dui[0];
  expect(row.consequence).toContain('independently of the criminal case');
  expect(row.consequence).toContain('conviction can have separate');
  expect(row.actionNote).toContain('state and notice type');
  expect(row.actionNote).not.toMatch(/Request|10 days|immediately/);
});
it('uses the verified publisher edition without widening the terroristic-threat instruction theory', () => {
  const rows = Object.values(texasVerifiedInstructions).filter(row => row?.instructionRef.includes('CPJC 22.28'));
  expect(rows).toHaveLength(5);
  for (const row of rows) {
    expect(row!.instructionUrl).toContain('version=055');
    expect(row!.instructionRef).toContain('individual imminent-serious-injury fear theory only');
  }
});
