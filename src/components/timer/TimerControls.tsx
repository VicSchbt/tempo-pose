import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import type { TimerPreset } from '@/store/timer.slice';
import type { TimerPresetId } from '@/types/core';
import { formatTimeFromSeconds, parseTimeToSeconds } from '@/lib/timer';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { TimerHelpTooltip } from './TimerHelpTooltip';
import { useTranslation } from '@/i18n/TranslationProvider';

const PRESETS: { id: TimerPresetId; seconds: TimerPreset | null }[] = [
  { id: '30s', seconds: 30 },
  { id: '60s', seconds: 60 },
  { id: '2m', seconds: 120 },
  { id: '5m', seconds: 300 },
  { id: 'custom', seconds: null },
];

type PresetTranslationKey = `timer.presets.${TimerPresetId}`;

const MIN_SECONDS = 1;
const MAX_SECONDS = 600;

export default function TimerControls() {
  const preset = useStore((s) => s.preset);
  const setPreset = useStore((s) => s.setPreset);
  const customSeconds = useStore((s) => s.customSeconds);
  const setCustomSeconds = useStore((s) => s.setCustomSeconds);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [timeInput, setTimeInput] = useState<string>('');
  const { t } = useTranslation();

  // Which preset is currently selected?
  const selectedId: TimerPresetId =
    preset === null ? 'custom' : (PRESETS.find((p) => p.seconds === preset)?.id ?? 'custom');

  const totalSeconds = preset ?? customSeconds ?? 0;

  // Sync timeInput with customSeconds when switching to custom mode or when customSeconds changes externally
  useEffect(() => {
    if (selectedId === 'custom' && customSeconds !== null && timeInput === '') {
      setTimeInput(formatTimeFromSeconds(customSeconds));
    }
  }, [selectedId, customSeconds]);

  const handlePresetClick = (id: TimerPresetId) => {
    const selected = PRESETS.find((p) => p.id === id);
    if (!selected) return;

    if (selected.seconds === null) {
      // Switch to custom mode
      setPreset(null);
      setValidationError(null);
      // Update input to show current custom value if it exists
      if (customSeconds !== null) {
        setTimeInput(formatTimeFromSeconds(customSeconds));
      } else {
        setTimeInput('');
      }
    } else {
      // Use fixed preset from the union type TimerPreset
      setPreset(selected.seconds);
      setValidationError(null);
      setTimeInput('');
      // Optional: clear custom if you don't want it to linger
      // setCustomSeconds(null);
    }
  };

  const handleCustomChange = (value: string) => {
    setTimeInput(value);

    if (value === '') {
      setCustomSeconds(null);
      setValidationError(null);
      return;
    }

    const totalSeconds = parseTimeToSeconds(value);

    if (totalSeconds === null) {
      setValidationError(t('timer.validation.format'));
      setCustomSeconds(null);
      return;
    }

    if (totalSeconds < MIN_SECONDS) {
      setValidationError(t('timer.validation.min', { value: formatTimeFromSeconds(MIN_SECONDS) }));
      setCustomSeconds(null);
      return;
    }

    if (totalSeconds > MAX_SECONDS) {
      setValidationError(
        t('timer.validation.max', {
          value: formatTimeFromSeconds(MAX_SECONDS),
          minutes: MAX_SECONDS / 60,
        }),
      );
      setCustomSeconds(null);
      return;
    }

    setValidationError(null);
    setCustomSeconds(totalSeconds);
  };

  return (
    <section aria-label={t('timer.sectionAria')} className="flex w-full flex-col gap-3">
      <header className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h2 id="timer-section-title" className="text-xl font-semibold">
            {t('timer.heading')}
          </h2>
        </div>

        {/* Tooltip with “image advances every X seconds” */}
        <TimerHelpTooltip />
      </header>
      <div
        role="radiogroup"
        aria-label={t('timer.presetsAria')}
        className="flex flex-wrap items-center gap-2"
      >
        {PRESETS.map((p) => {
          const isSelected = selectedId === p.id;
          const label = t(`timer.presets.${p.id}` as PresetTranslationKey);
          return (
            <Button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={label}
              onClick={() => handlePresetClick(p.id)}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              className="min-w-12"
            >
              {label}
            </Button>
          );
        })}
      </div>

      {selectedId === 'custom' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="custom-time" className="text-muted-foreground text-sm">
              {t('timer.customLabel')}
            </Label>
            <Input
              id="custom-time"
              type="text"
              placeholder={t('timer.placeholder')}
              className="w-24 font-mono"
              value={
                timeInput !== ''
                  ? timeInput
                  : customSeconds !== null
                    ? formatTimeFromSeconds(customSeconds)
                    : ''
              }
              onChange={(e) => handleCustomChange(e.target.value)}
              aria-label={t('timer.customInputAria')}
              aria-invalid={validationError !== null}
              aria-describedby={validationError ? 'custom-time-error' : undefined}
            />
          </div>
          {validationError && (
            <p id="custom-time-error" className="text-destructive text-xs" role="alert">
              {validationError}
            </p>
          )}
        </div>
      )}

      <span className="text-muted-foreground text-sm">
        {t('timer.summaryLabel')}{' '}
        <span className="font-medium">{totalSeconds}</span>
        {t('timer.summarySuffix')}
      </span>
    </section>
  );
}
