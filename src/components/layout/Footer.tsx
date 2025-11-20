import { useTranslation } from '@/i18n/TranslationProvider';

export default function Footer() {
  const { t } = useTranslation();
  const appName = t('app.name');
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-background border-t">
      <div className="text-muted-foreground mx-auto max-w-5xl px-4 py-4 text-center text-sm">
        {t('footer.copy', { year, appName })}
      </div>
    </footer>
  );
}
