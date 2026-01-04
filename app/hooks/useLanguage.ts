"use client";

import { useState, useEffect } from "react";

export type Language = "ja" | "en";

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("ja");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    const browserLanguage = navigator.language.startsWith("ja") ? "ja" : "en";
    const initialLanguage = savedLanguage || browserLanguage;

    setLanguage(initialLanguage);
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLanguage = prev === "ja" ? "en" : "ja";
      localStorage.setItem("language", newLanguage);
      return newLanguage;
    });
  };

  const setLang = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return {
    language,
    toggleLanguage,
    setLanguage: setLang,
    isJapanese: language === "ja",
    isEnglish: language === "en",
  };
}
