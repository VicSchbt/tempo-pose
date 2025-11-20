import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { useSessionClock } from '@/hooks/useSessionClock';
import { resolveTimerDurationMs } from '@/lib/timer';
import type { TimerPresetId } from '@/types/core';
import SessionView from '@/components/session/SessionView';
import { useTranslation } from '@/i18n/TranslationProvider';

export default function SessionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const images = useStore((s) => s.images);
  const sessionQueue = useStore((s) => s.sessionQueue);
  const ptr = useStore((s) => s.ptr);
  const isActive = useStore((s) => s.isActive);
  const isPaused = useStore((s) => s.isPaused);
  const elapsedMs = useStore((s) => s.elapsedMs);
  const preset = useStore((s) => s.preset);
  const customSeconds = useStore((s) => s.customSeconds);
  const next = useStore((s) => s.next);
  const prev = useStore((s) => s.prev);
  const endSession = useStore((s) => s.endSession);
  const clearImages = useStore((s) => s.clearImages);
  const pauseSession = useStore((s) => s.pauseSession);
  const resumeSession = useStore((s) => s.resumeSession);
  const isMuted = useStore((s) => s.isMuted);
  const toggleMute = useStore((s) => s.toggleMute);
  const sessionSummary = useStore((s) => s.sessionSummary);

  // TEMPO-39: Use session clock hook for drift-safe timing
  useSessionClock();

  useEffect(() => {
    if (!isActive && sessionSummary) {
      navigate('/session/end', { replace: true });
    }
  }, [isActive, sessionSummary, navigate]);

  // If session is not active, redirect to home
  if (sessionSummary && !isActive) {
    return null;
  }

  if (!isActive || sessionQueue.length === 0) {
    return (
      <div className="flex h-svh flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">{t('session.noActive')}</p>
        <Button onClick={() => navigate('/')}>{t('session.goHome')}</Button>
      </div>
    );
  }

  // TEMPO-36: Create SessionView showing current image from queue[ptr]
  const currentImageId = sessionQueue[ptr];
  const currentImage = images.find((img) => img.id === currentImageId);

  // TEMPO-37: Show remaining count and progress (e.g., "7/20")
  const currentPosition = ptr + 1;
  const totalImages = sessionQueue.length;
  const remaining = totalImages - currentPosition;

  // Calculate interval duration and progress (TEMPO-41)
  const getIntervalDurationMs = (): number => {
    const presetId: TimerPresetId =
      preset === 30
        ? '30s'
        : preset === 60
          ? '60s'
          : preset === 120
            ? '2m'
            : preset === 300
              ? '5m'
              : 'custom';
    return resolveTimerDurationMs(presetId, customSeconds);
  };

  const intervalDurationMs = getIntervalDurationMs();
  const progressPercentage = intervalDurationMs > 0 ? (elapsedMs / intervalDurationMs) * 100 : 0;
  const remainingSeconds = Math.max(0, Math.ceil((intervalDurationMs - elapsedMs) / 1000));

  if (!currentImage) {
    return (
      <div className="flex h-svh flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">{t('session.imageMissing')}</p>
        <Button onClick={() => navigate('/')}>{t('session.goHome')}</Button>
      </div>
    );
  }

  const handleEndSession = () => {
    endSession('manual');
    clearImages();
  };

  return (
    <SessionView
      currentImage={currentImage}
      currentPosition={currentPosition}
      totalImages={totalImages}
      remainingCount={remaining}
      progressPercentage={progressPercentage}
      remainingSeconds={remainingSeconds}
      isPaused={isPaused}
      isMuted={isMuted}
      onPrev={prev}
      onNext={next}
      onPause={pauseSession}
      onResume={resumeSession}
      onToggleMute={toggleMute}
      onEndSession={handleEndSession}
      hasMultipleImages={sessionQueue.length > 1}
    />
  );
}
