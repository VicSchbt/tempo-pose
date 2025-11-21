import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImageIcon, Music2Icon, PlayCircleIcon, Share2Icon } from 'lucide-react';
import { useTranslation } from '@/i18n/TranslationProvider';

const STORAGE_KEY = 'tempoPose.helpDialogDismissed';

const helpSteps = [
  {
    icon: ImageIcon,
    key: 'pickPose',
  },
  {
    icon: Music2Icon,
    key: 'setTempo',
  },
  {
    icon: PlayCircleIcon,
    key: 'previewMoves',
  },
  {
    icon: Share2Icon,
    key: 'exportShare',
  },
] as const;

type HelpStepKey = (typeof helpSteps)[number]['key'];
type HelpStepTitleKey = `dialogs.help.steps.${HelpStepKey}.title`;
type HelpStepDescriptionKey = `dialogs.help.steps.${HelpStepKey}.description`;

export default function FirstTimeHelpDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const hasDismissed = window.localStorage.getItem(STORAGE_KEY);
    if (!hasDismissed) {
      setIsOpen(true);
    }
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen);
    if (!nextOpen && typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('dialogs.help.title')}</DialogTitle>
          <DialogDescription>{t('dialogs.help.description')}</DialogDescription>
        </DialogHeader>

        <ol className="space-y-4">
          {helpSteps.map((step) => {
            const title = t(`dialogs.help.steps.${step.key}.title` as HelpStepTitleKey);
            const description = t(
              `dialogs.help.steps.${step.key}.description` as HelpStepDescriptionKey,
            );
            return (
              <li key={step.key} className="flex items-start gap-4">
                <span className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full">
                  <step.icon className="size-5" aria-hidden />
                </span>
                <div className="space-y-1">
                  <p className="font-medium">{title}</p>
                  <p className="text-muted-foreground text-sm">{description}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="text-muted-foreground text-sm mt-2">
          {t('dialogs.help.keepScreenAwakeHint')}
        </p>

        <DialogFooter>
          <Button className="mt-4 w-full" onClick={() => handleOpenChange(false)}>
            {t('dialogs.help.dismiss')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
