import { useStore } from '@/store';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import Main from './components/layout/Main';
import ImageDrop from '@/components/images/ImageDrop';
import TimerControls from '@/components/timer/TimerControls';
import SessionControls from '@/components/session/SessionControls';
import CurrentImage from '@/components/session/CurrentImage';
import ImageGrid from './components/gallery/ImageGrid';

export default function App() {
  const imagesCount = useStore((s) => s.images.length);

  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <Header />
      <Main>
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Session</h2>
            <span className="text-muted-foreground text-sm">{imagesCount} images loaded</span>
          </div>

          <ImageDrop className="mt-6" />
          <ImageGrid />

          <div className="flex items-center gap-4">
            <TimerControls />
            <SessionControls />
          </div>

          <CurrentImage />
        </section>
      </Main>
      <Footer />
    </div>
  );
}
