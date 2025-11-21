import { useTranslation, type Locale } from '@/i18n/TranslationProvider';

export function LanguageToggle() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <div className="relative">
      <label htmlFor="language-toggle" className="sr-only">
        {t('languageSwitch.aria')}
      </label>
      <select
        id="language-toggle"
        className="border-input bg-background text-foreground focus-visible:ring-ring focus-visible:ring-offset-background h-11 min-h-11 min-w-11 rounded-md border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        aria-label={t('languageSwitch.label')}
      >
        <option value="en">{t('languageSwitch.english')}</option>
        <option value="fr">{t('languageSwitch.french')}</option>
      </select>
    </div>
  );
}

