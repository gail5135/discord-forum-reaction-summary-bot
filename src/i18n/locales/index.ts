import { ja } from "./ja";
import { ko } from "./ko";
import { en } from "./en";

export const resources = {
  ja,
  ko,
  en,
} as const;

export type Resources = typeof resources.ja;
export type Locale = keyof typeof resources;
