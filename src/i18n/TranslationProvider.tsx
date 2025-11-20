import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  translations,
  type Locale,
  type Translation,
  type TranslationKey,
  type TranslationParams,
} from './translations';

type TranslationContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
};

const TranslationContext = createContext<TranslationContextValue | null>(null);

const DEFAULT_LOCALE: Locale = 'en';
const STORAGE_KEY = 'tempoPose.locale';

type TranslationProviderProps = {
  children: ReactNode;
};

function resolveKey(dictionary: Translation, key: TranslationKey): string {
  const segments = key.split('.');
  let current: unknown = dictionary;

  for (const segment of segments) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[segment];
    } else {
      current = undefined;
      break;
    }
  }

  if (typeof current !== 'string') {
    throw new Error(`Missing translation for key "${key}"`);
  }

  return current;
}

function formatTemplate(template: string, params?: TranslationParams) {
  if (!params) return template;
  return template.replace(/{{\s*(\w+)\s*}}/g, (match, paramKey) => {
    if (params[paramKey] === undefined) {
      return match;
    }
    return String(params[paramKey]);
  });
}

function readStoredLocale(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && stored in translations ? (stored as Locale) : DEFAULT_LOCALE;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const dictionary = translations[locale];

  const translate = useCallback(
    (key: TranslationKey, params?: TranslationParams) => {
      const template = resolveKey(dictionary, key);
      return formatTemplate(template, params);
    },
    [dictionary],
  );

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
    },
    [setLocaleState],
  );

  const value = useMemo<TranslationContextValue>(
    () => ({
      locale,
      setLocale,
      t: translate,
    }),
    [locale, setLocale, translate],
  );

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

export type { Locale } from './translations';

