'use client';

import { Info } from 'lucide-react';
import { useStore } from '@/store';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/i18n/TranslationProvider';

export function TimerHelpTooltip() {
  const preset = useStore((s) => s.preset);
  const customSeconds = useStore((s) => s.customSeconds);
  const { t } = useTranslation();

  const seconds = preset ?? customSeconds ?? 60;

  const label = t('timer.tooltip', { seconds });

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={label}
            className="border-border text-muted-foreground hover:bg-muted focus-visible:ring-ring focus-visible:ring-offset-background inline-flex size-11 items-center justify-center rounded-full border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs">
          <p>
            Image advances every <span className="font-semibold">{seconds}</span> seconds.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
