import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './locales/vi.json';
import en from './locales/en.json';

const resources = {
  vi: { translation: vi },
  en: { translation: en },
};

const htmlLang = document?.querySelector('html')?.getAttribute('lang') || 'vi';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: htmlLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
