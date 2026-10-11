"use client";
import { createContext, useContext, type ReactNode } from "react";
import { getDictionary, type Dict } from "./dictionaries";
import type { Locale } from "./config";

const LocaleContext = createContext<Locale>("zh");

export function LocaleProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={lang}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useDict(): Dict {
  return getDictionary(useLocale());
}
