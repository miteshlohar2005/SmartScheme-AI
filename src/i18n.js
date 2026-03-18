import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json';
import hiTranslation from './locales/hi/translation.json';
import mrTranslation from './locales/mr/translation.json';

const getInitialLanguage = () => {
    const savedLanguage = localStorage.getItem('app_language');
    return savedLanguage || 'en';
};

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            hi: { translation: hiTranslation },
            mr: { translation: mrTranslation }
        },
        lng: getInitialLanguage(),
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

// Save to localStorage when language changes
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('app_language', lng);
});

export default i18n;
