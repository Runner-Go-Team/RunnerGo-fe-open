import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';

import cn from './cn.json';
import en from './en.json';

const resources = {
    cn: {
        translation: cn,
    },
    en: {
        translation: en,
    }
};

i18n.use(LanguageDetector)
.use(initReactI18next)
.init({
    resources,
    fallbackLng: 'cn',
    detection: {
        caches: ['localStorage', 'sessionStorage', 'cookie'],
    }
});

export default i18n;