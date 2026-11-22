import { describe, expect, it } from 'vitest';
import { generateEnhancedGuidance } from '../server/services/guidance-engine';

for (const caseStage of ['arrest', 'arraignment']) {
  describe(`${caseStage} counsel and bail process`, () => {
    for (const hasAttorney of [true, false, null, undefined]) {
      it(`preserves representation status ${String(hasAttorney)} without promising appointment or release`, () => {
        const result = generateEnhancedGuidance({
          jurisdiction: 'OR', charges: '', caseStage, custodyStatus: 'in_custody', hasAttorney,
        });
        const text = JSON.stringify(result);
        expect(text).not.toMatch(/Ask for a public defender|Talk to the judge about bail|so you can get out of jail|the court will appoint a public defender|Right to reasonable bail/);
        expect(result.rights).toContain('Protection against excessive bail; release is not guaranteed');
        if (caseStage === 'arraignment') {
          expect(result.immediateActions.some(item => item.action.includes('through the court process'))).toBe(true);
        }
        if (hasAttorney === false) {
          expect(result.resources.some(item => item.description.includes('applicable eligibility rules'))).toBe(true);
          expect(result.overview).toContain('may be available');
          if (caseStage === 'arrest') {
            expect(result.immediateActions[0]).toMatchObject({
              urgency: 'urgent', treatment: 'legal-information',
            });
            expect(result.immediateActions[0].action).toContain('eligibility and application procedures');
          } else {
            const qa = result.mockQA?.find(item => item.question.includes('need one appointed'));
            expect(qa?.suggestedResponse).toContain('If you want appointed counsel');
            expect(qa?.suggestedResponse).toContain('How do I apply');
            expect(qa?.explanation).toContain('another assigned lawyer');
            expect(qa?.explanation).toContain('not determined by this roadmap');
          }
        } else {
          expect(result.resources.some(item => item.type === 'Public Defender Office')).toBe(false);
          expect(result.immediateActions.some(item => item.action.startsWith('Court-appointed counsel eligibility and application'))).toBe(false);
        }
      });
    }
  });
}
