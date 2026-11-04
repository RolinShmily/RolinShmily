import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Locale, I18nDictionary } from "./types";
import { en } from "./locales/en";
import { zh } from "./locales/zh";

interface I18nContextValue {
  locale: Locale;
  t: I18nDictionary;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to English as requested
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("app_lang");
      if (saved === "zh" || saved === "en") {
        return saved;
      }
    }
    return "en";
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("app_lang", newLocale);
    }
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "zh" : "en");
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          "content",
          locale === "zh"
            ? "RoL1n_SrP 的个人主页 — 开发者、游戏玩家、吉他爱好者。"
            : "RoL1n_SrP's personal homepage — developer, gamer, guitarist."
        );
      }
    }
  }, [locale]);

  const t = useMemo(() => (locale === "zh" ? zh : en), [locale]);

  const value = useMemo(
    () => ({
      locale,
      t,
      setLocale,
      toggleLocale,
    }),
    [locale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}
