import { describe, expect, it } from 'vitest';
import en from '../client/src/locales/en';
import es from '../client/src/locales/es';
import zh from '../client/src/locales/zh';
import { ohioReselectionNotice } from '../client/src/lib/ohio-guidance-output';

for (const [language, locale] of Object.entries({ en, es, zh })) {
  describe(`${language} Ohio confirmation wording`, () => {
    it('uses the current saved-roadmap confirmation heading for output refusal, including regional language codes', () => {
      const heading = locale.translation.guidance.ohioSavedChargeNotice.split(/[.。]/)[0];
      expect(ohioReselectionNotice(language)).toContain(heading);
      expect(ohioReselectionNotice(`${language}-test`)).toContain(heading);
    });
  });
}
