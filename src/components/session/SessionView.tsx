import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FocusEvent } from 'react';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { formatTimeFromSeconds } from '@/lib/timer';
import type { ImageItem } from '@/types/core';

type SessionViewProps = {
  currentImage: ImageItem;
  currentPosition: number;
  totalImages: number;
  remainingCount: number;
  progressPercentage: number;
  remainingSeconds: number;
  isPaused: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPause: () => void;
  onResume: () => void;
  onEndSession: () => void;
  hasMultipleImages: boolean;
};

const isEditableElement = (element: HTMLElement | null) => {
  if (!element) {
    return false;
  }

  const tag = element.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    element.isContentEditable
  );
};

const isButtonLikeElement = (element: HTMLElement | null) => {
  if (!element) {
    return false;
  }

  if (element.tagName === 'BUTTON') {
    return true;
  }

  const role = element.getAttribute('role');
  return role === 'button';
};

export default function SessionView({
  currentImage,
  currentPosition,
  totalImages,
  remainingCount,
  progressPercentage,
  remainingSeconds,
  isPaused,
  onPrev,
  onNext,
  onPause,
  onResume,
  onEndSession,
  hasMultipleImages,
}: SessionViewProps) {
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

  const toggleFullscreen = useCallback(() => {
    const node = rootRef.current;
    if (!node || typeof document === 'undefined') {
      return;
    }

    if (document.fullscreenElement) {
      void document.exitFullscreen?.();
    } else {
      void node.requestFullscreen?.();
    }
  }, []);

  const shortcutsEnabled = hasFocusWithin && isWindowFocused;

  const handleFocusCapture = useCallback(() => {
    setHasFocusWithin(true);
  }, []);

  const handleBlurCapture = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      const nextTarget = event.relatedTarget as HTMLElement | null;
      if (!rootRef.current?.contains(nextTarget)) {
        setHasFocusWithin(false);
      }
    },
    [],
  );

  const handleTogglePause = useCallback(() => {
    if (isPaused) {
      onResume();
      return;
    }
    onPause();
  }, [isPaused, onPause, onResume]);

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
      const target = event.target as HTMLElement | null;

      if (isEditableElement(target)) {
        return;
      }

      const key = event.key.toLowerCase();
      const code = event.code;

      if (code === 'Space') {
        const allowsSpaceOverride = target?.dataset.sessionShortcut === 'pause';
        if (isButtonLikeElement(target) && !allowsSpaceOverride) {
          return;
        }
        event.preventDefault();
        handleTogglePause();
        return;
      }

      if (key === 'n') {
        event.preventDefault();
        onNext();
        return;
      }

      if (key === 'p') {
        event.preventDefault();
        onPrev();
        return;
      }

      if (key === 'f') {
        event.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcutsEnabled, handleTogglePause, onNext, onPrev, toggleFullscreen]);

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      data-session-view
      className="bg-background text-foreground flex h-svh flex-col overflow-hidden outline-none"
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      aria-label="Session view"
    >
      <div className="border-border bg-background shrink-0 border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight">Tempo Pose</h1>
            <span className="text-muted-foreground text-xs">
              {shortcutsEnabled ? 'Keyboard shortcuts active' : 'Click to enable keyboard shortcuts'}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onEndSession}>
            End Session
          </Button>
        </div>
      </div>

      <main className="mx-auto flex max-w-5xl flex-1 flex-col overflow-hidden px-4 py-4">
        <div className="shrink-0 space-y-3 pb-3">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              Progress:{' '}
              <span className="font-medium">
                {currentPosition}/{totalImages}
              </span>
            </div>
            <div className="text-muted-foreground text-sm">
              Remaining: <span className="font-medium">{remainingCount}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">
                Next image in:{' '}
                <span className="font-medium">{formatTimeFromSeconds(remainingSeconds)}</span>
              </span>
              {isPaused && (
                <span className="text-muted-foreground text-xs font-medium">Paused</span>
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
                aria-label="Interval progress"
              />
            </div>
          </div>
        </div>

        <figure className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 items-center justify-center overflow-hidden">
            <img
              src={currentImage.url}
              alt={currentImage.name ?? 'Reference image'}
              className="max-h-full max-w-full rounded object-contain"
            />
          </div>
          <figcaption className="text-muted-foreground shrink-0 pt-2 text-center text-sm">
            {currentImage.name ?? 'Image'}
          </figcaption>
        </figure>

        <div className="shrink-0 pt-4">
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={onPrev} disabled={!hasMultipleImages}>
              Previous
            </Button>
            <Button
              variant={isPaused ? 'default' : 'outline'}
              onClick={handleTogglePause}
              aria-label={isPaused ? 'Resume session' : 'Pause session'}
              data-session-shortcut="pause"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button variant="outline" onClick={onNext} disabled={!hasMultipleImages}>
              Next
            </Button>
          </div>
          <div className="text-muted-foreground mt-2 text-center text-xs">
            {isFullscreen ? 'Press F to exit fullscreen' : 'Press F for fullscreen'}
          </div>
        </div>
      </main>

      <div className="shrink-0">
        <Footer />
      </div>
    </div>
  );
}


