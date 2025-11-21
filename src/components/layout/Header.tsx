import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageToggle } from '@/components/language/LanguageToggle';
import { useTranslation } from '@/i18n/TranslationProvider';

export default function Header() {
  const { t } = useTranslation();

  const handleSettingsClick = () => {
    alert(t('header.settingsSoon'));
  };

  return (
    <header className="border-border bg-background sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <h1 className="text-lg font-semibold tracking-tight">{t('app.name')}</h1>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleSettingsClick}>
            {t('header.settings')}
          </Button>
        </div>
      </div>
    </header>
  );
}
