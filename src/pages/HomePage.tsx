import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Main from '@/components/layout/Main';
import ImageDrop from '@/components/images/ImageDrop';
import TimerControls from '@/components/timer/TimerControls';
import SessionControls from '@/components/session/SessionControls';
import ImageGrid from '@/components/gallery/ImageGrid';
import { Toaster } from 'sonner';

export default function HomePage() {
  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <Header />
      <Main>
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Session</h2>
          </div>

          <ImageDrop className="mt-6" />
          <ImageGrid />

          <div className="flex flex-col items-center gap-8">
            <TimerControls />
            <SessionControls />
          </div>
        </section>
      </Main>
      <Footer />
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
}
