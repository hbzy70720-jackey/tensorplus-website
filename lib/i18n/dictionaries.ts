// dictionaries.ts（server/client 通用）
import { zh } from "./locales/zh";
import { en } from "./locales/en";

export type Dict = typeof zh;
export function getDictionary(lang: string): Dict {
  return lang === "en" ? en : zh;
}
