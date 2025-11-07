import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import teTranslations from "@shared/i18n/te.json";
import enTranslations from "@shared/i18n/en.json";

i18n.use(initReactI18next).init({
  resources: {
    te: { translation: teTranslations },
    en: { translation: enTranslations },
  },
  lng: localStorage.getItem("language") || "te",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
