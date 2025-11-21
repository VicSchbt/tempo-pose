import enTranslation, { type EnTranslation } from './locales/en';
import frTranslation from './locales/fr';

export const translations = {
  en: enTranslation,
  fr: frTranslation,
} as const;

export type Locale = keyof typeof translations;
export type Translation = EnTranslation;

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
