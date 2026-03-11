export const locales = ['en', 'ko', 'vi'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
