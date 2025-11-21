import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FocusEvent } from 'react';
import { Maximize, Minimize, Volume2, VolumeX } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatTimeFromSeconds } from '@/lib/timer';
import type { ImageItem } from '@/types/core';
import {
  type ShortcutBinding,
  handleKeyboardShortcut,
  isButtonLikeElement,
} from '@/utils/keyboardShortcuts';
import { getFullscreenHint, isFullscreenSupported } from '@/utils/fullscreen';
import { useTranslation } from '@/i18n/TranslationProvider';

type SessionViewProps = {
  currentImage: ImageItem;
  currentPosition: number;
  totalImages: number;
  remainingCount: number;
  progressPercentage: number;
  remainingSeconds: number;
  isPaused: boolean;
  isMuted: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPause: () => void;
  onResume: () => void;
  onToggleMute: () => void;
  onEndSession: () => void;
  hasMultipleImages: boolean;
};

export default function SessionView({
  currentImage,
  currentPosition,
  totalImages,
  remainingCount,
  progressPercentage,
  remainingSeconds,
  isPaused,
  isMuted,
  onPrev,
  onNext,
  onPause,
  onResume,
  onToggleMute,
  onEndSession,
  hasMultipleImages,
}: SessionViewProps) {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const [isWindowFocused, setIsWindowFocused] = useState(() => {
    if (typeof document === 'undefined') {
      return true;
    }
    return document.hasFocus();
  });
  const [isFullscreen, setIsFullscreen] = useState(() => {
    if (typeof document === 'undefined') {
      return false;
    }
    return Boolean(document.fullscreenElement);
  });

  const normalizedProgress = useMemo(() => {
    if (Number.isNaN(progressPercentage)) {
      return 0;
    }
    return Math.min(100, Math.max(0, progressPercentage));
  }, [progressPercentage]);

  const fullscreenSupported = useMemo(() => isFullscreenSupported(), []);

  const toggleFullscreen = useCallback(() => {
    if (!fullscreenSupported) {
      return;
    }

    const node = rootRef.current;
    if (!node || typeof document === 'undefined') {
      return;
    }

    if (document.fullscreenElement) {
      void document.exitFullscreen?.();
    } else {
      void node.requestFullscreen?.();
    }
  }, [fullscreenSupported]);

  const shortcutsEnabled = hasFocusWithin && isWindowFocused;

  const handleFocusCapture = useCallback(() => {
    setHasFocusWithin(true);
  }, []);

  const handleBlurCapture = useCallback((event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget as HTMLElement | null;
    if (!rootRef.current?.contains(nextTarget)) {
      setHasFocusWithin(false);
    }
  }, []);

  const handleTogglePause = useCallback(() => {
    if (isPaused) {
      onResume();
      return;
    }
    onPause();
  }, [isPaused, onPause, onResume]);

  const codeShortcutMap = useMemo<Map<string, ShortcutBinding>>(
    () =>
      new Map([
        [
          'Space',
          {
            action: handleTogglePause,
            preventDefault: true,
            shouldIgnoreTarget: (target) =>
              isButtonLikeElement(target) && target?.dataset.sessionShortcut !== 'pause',
          },
        ],
      ]),
    [handleTogglePause],
  );

  const keyShortcutMap = useMemo<Map<string, ShortcutBinding>>(() => {
    const map = new Map<string, ShortcutBinding>([
      [
        'n',
        {
          action: onNext,
          preventDefault: true,
        },
      ],
      [
        'p',
        {
          action: onPrev,
          preventDefault: true,
        },
      ],
    ]);

    // Only add fullscreen shortcut if supported
    if (fullscreenSupported) {
      map.set('f', {
        action: toggleFullscreen,
        preventDefault: true,
      });
    }

    return map;
  }, [onNext, onPrev, toggleFullscreen, fullscreenSupported]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) {
      return;
    }
    node.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => setIsWindowFocused(false);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const handleVisibility = () => {
      setIsWindowFocused(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!shortcutsEnabled || typeof window === 'undefined') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      handleKeyboardShortcut(event, codeShortcutMap, keyShortcutMap);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcutsEnabled, codeShortcutMap, keyShortcutMap]);

  const fullscreenHintLabels = useMemo(
    () => ({
      unsupported: t('fullscreen.unsupported'),
      enter: t('fullscreen.enter'),
      exit: t('fullscreen.exit'),
    }),
    [t],
  );

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      data-session-view
      className="bg-background text-foreground flex h-svh flex-col overflow-hidden outline-none"
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      aria-label={t('session.view.ariaLabel')}
    >
      <div className="border-border bg-background shrink-0 border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight">{t('app.name')}</h1>
            <span className="text-muted-foreground text-xs">
              {shortcutsEnabled ? t('session.view.keyboardActive') : t('session.view.keyboardInactive')}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onEndSession}>
            {t('session.view.end')}
          </Button>
        </div>
      </div>

      <main className="mx-auto flex max-w-5xl flex-1 flex-col overflow-hidden px-4 py-4">
        <div className="shrink-0 space-y-3 pb-3">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              {t('session.view.progress')}{' '}
              <span className="font-medium">
                {currentPosition}/{totalImages}
              </span>
            </div>
            <div className="text-muted-foreground text-sm">
              {t('session.view.remaining')}{' '}
              <span className="font-medium">{remainingCount}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">
                {t('session.view.nextImageIn')}{' '}
                <span className="font-medium">{formatTimeFromSeconds(remainingSeconds)}</span>
              </span>
              {isPaused && (
                <span className="text-muted-foreground text-xs font-medium">
                  {t('session.view.paused')}
                </span>
              )}
            </div>
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full transition-all duration-100 ease-linear"
                style={{ width: `${normalizedProgress}%` }}
                role="progressbar"
                aria-valuenow={normalizedProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={t('accessibility.intervalProgress')}
              />
            </div>
          </div>
        </div>

        <figure className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 items-center justify-center overflow-hidden">
            <img
              src={currentImage.url}
              alt={currentImage.name ?? t('session.view.referenceFallback')}
              className="max-h-full max-w-full rounded object-contain"
            />
          </div>
          <figcaption className="text-muted-foreground shrink-0 pt-2 text-center text-sm">
            {currentImage.name ?? t('session.view.imageFallback')}
          </figcaption>
        </figure>

        <div className="shrink-0 pt-4">
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={onPrev} disabled={!hasMultipleImages}>
              {t('session.view.previous')}
            </Button>
            <Button
              variant={isPaused ? 'default' : 'outline'}
              onClick={handleTogglePause}
              aria-label={isPaused ? t('accessibility.resumeSession') : t('accessibility.pauseSession')}
              data-session-shortcut="pause"
            >
              {isPaused ? t('session.view.resume') : t('session.view.pause')}
            </Button>
            <Button variant="outline" onClick={onNext} disabled={!hasMultipleImages}>
              {t('session.view.next')}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onToggleMute}
              aria-label={isMuted ? t('accessibility.unmute') : t('accessibility.mute')}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Volume2 className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
            {fullscreenSupported && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                aria-label={
                  isFullscreen ? t('accessibility.exitFullscreen') : t('accessibility.enterFullscreen')
                }
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Maximize className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            )}
          </div>
          <div className="text-muted-foreground mt-3 text-center text-xs">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5">
                <Badge variant="secondary" className="font-mono text-[10px] uppercase">
                  Space
                </Badge>
                <span>{t('session.view.badges.pause')}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Badge variant="secondary" className="font-mono text-[10px] uppercase">
                  N
                </Badge>
                <span>{t('session.view.badges.next')}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Badge variant="secondary" className="font-mono text-[10px] uppercase">
                  P
                </Badge>
                <span>{t('session.view.badges.prev')}</span>
              </span>
              {fullscreenSupported && (
                <span className="flex items-center gap-1.5">
                  <Badge variant="secondary" className="font-mono text-[10px] uppercase">
                    F
                  </Badge>
                  <span>{getFullscreenHint(isFullscreen, fullscreenSupported, fullscreenHintLabels)}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="shrink-0">
        <Footer />
      </div>
    </div>
  );
}
