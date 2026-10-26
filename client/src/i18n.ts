import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en';
import es from './locales/es';
import zh from './locales/zh';

// Keep assistive technology and CSS :lang() in sync with the rendered locale.
function syncDocumentLanguage() {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = i18n.resolvedLanguage || i18n.language || 'en';
  }
}
i18n.on('languageChanged', syncDocumentLanguage);
i18n.on('initialized', syncDocumentLanguage);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    resources: { en, es, zh },
  });

export default i18n;
