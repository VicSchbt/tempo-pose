import enTranslation, { type TranslationSchema } from './locales/en';
import frTranslation from './locales/fr';

const localeTranslations = {
  en: enTranslation,
  fr: frTranslation,
} as const;

export type Locale = keyof typeof localeTranslations;

export const translations: Record<Locale, TranslationSchema> = localeTranslations;
export type Translation = typeof enTranslation;
export type { TranslationSchema } from './locales/en';

type Join<K extends string, P extends string> = `${K}.${P}`;
type LeafKeys<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends Record<string, unknown>
      ? Join<K, LeafKeys<T[K]>>
      : never;
}[keyof T & string];

export type TranslationKey = LeafKeys<Translation>;

export type TranslationParams = Record<string, string | number>;
