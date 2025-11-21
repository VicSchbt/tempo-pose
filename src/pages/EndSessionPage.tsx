import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Main from '@/components/layout/Main';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { formatTimeFromSeconds } from '@/lib/timer';
import { useTranslation } from '@/i18n/TranslationProvider';

export default function EndSessionPage() {
  const navigate = useNavigate();
  const sessionSummary = useStore((s) => s.sessionSummary);
  const { t } = useTranslation();

  useEffect(() => {
    if (!sessionSummary) {
      navigate('/', { replace: true });
    }
  }, [sessionSummary, navigate]);

  if (!sessionSummary) {
    return null;
  }

  const durationSeconds = Math.max(0, Math.round(sessionSummary.durationMs / 1000));
  const averageMs =
    sessionSummary.imagesShown > 0 ? sessionSummary.durationMs / sessionSummary.imagesShown : 0;
  const averageSeconds = Math.max(0, averageMs / 1000);
  const reasonLabel =
    sessionSummary.reason === 'completed'
      ? t('endSession.reasonCompleted')
      : t('endSession.reasonManual');

  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <Header />
      <Main>
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center">
          <div>
            <p className="text-muted-foreground text-sm font-semibold tracking-[0.3em] uppercase">
              {t('endSession.badge')}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {t('endSession.title')}
            </h1>
            <p className="text-muted-foreground mt-3 text-base">{reasonLabel}</p>
          </div>

          <div className="grid w-full gap-4 rounded-lg border border-dashed p-6 sm:grid-cols-3">
            <div>
              <p className="text-muted-foreground text-sm">{t('endSession.statsImages')}</p>
              <p className="text-2xl font-semibold">{sessionSummary.imagesShown}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{t('endSession.statsDuration')}</p>
              <p className="text-2xl font-semibold">{formatTimeFromSeconds(durationSeconds)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{t('endSession.statsAverage')}</p>
              <p className="text-2xl font-semibold">
                {averageSeconds.toFixed(1)}
                {t('timer.summarySuffix')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => navigate('/')}>{t('endSession.backHome')}</Button>
            {/* <Button
              variant="outline"
              onClick={() => navigate('/')}
              aria-label="Start a new session"
            >
              Start another session
            </Button> */}
          </div>
        </section>
      </Main>
      <Footer />
    </div>
  );
}
