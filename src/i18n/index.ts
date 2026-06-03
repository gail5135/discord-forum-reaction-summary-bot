import { resources, Locale, Resources } from "./locales";

/**
 * 점(dot) 표기법을 사용하여 중첩된 속성에 접근합니다.
 * 예: "error.cannotEdit"
 */
export function t(key: string, locale: string = "en"): string {
  // 로케일이 존재하는지 확인하고, 기본값은 'en'을 사용합니다.
  const targetLocale = (
    Object.keys(resources).includes(locale) ? locale : "en"
  ) as Locale;

  const keys = key.split(".");
  let current: any = resources[targetLocale];

  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      console.warn(`번역 키를 찾을 수 없습니다: ${key}, 로케일: ${locale}`);
      return key; // 키를 대체값으로 반환
    }
  }

  return typeof current === "string" ? current : key;
}
