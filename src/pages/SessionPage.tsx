import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/layout/Footer';

export default function SessionPage() {
  const navigate = useNavigate();
  const images = useStore((s) => s.images);
  const sessionQueue = useStore((s) => s.sessionQueue);
  const ptr = useStore((s) => s.ptr);
  const isActive = useStore((s) => s.isActive);
  const next = useStore((s) => s.next);
  const prev = useStore((s) => s.prev);
  const stopSession = useStore((s) => s.stopSession);
  const clearImages = useStore((s) => s.clearImages);

  // If session is not active, redirect to home
  if (!isActive || sessionQueue.length === 0) {
    return (
      <div className="flex h-svh flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">No active session</p>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
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

  if (!currentImage) {
    return (
      <div className="flex h-svh flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">Image not found</p>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground flex h-svh flex-col overflow-hidden">
      {/* Header */}
      <div className="border-border bg-background shrink-0 border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <h1 className="text-lg font-semibold tracking-tight">Tempo Pose</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              stopSession();
              // Clear images when ending session to show empty gallery state
              clearImages();
              navigate('/');
            }}
          >
            End Session
          </Button>
        </div>
      </div>

      {/* Main content area - takes remaining space */}
      <main className="mx-auto flex max-w-5xl flex-1 flex-col overflow-hidden px-4 py-4">
        {/* Progress indicator - fixed height */}
        <div className="shrink-0 pb-3">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              Progress:{' '}
              <span className="font-medium">
                {currentPosition}/{totalImages}
              </span>
            </div>
            <div className="text-muted-foreground text-sm">
              Remaining: <span className="font-medium">{remaining}</span>
            </div>
          </div>
        </div>

        {/* Image area - flex-1 to take remaining space */}
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

        {/* Navigation controls - fixed height */}
        <div className="shrink-0 pt-4">
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={prev} disabled={sessionQueue.length <= 1}>
              Previous
            </Button>
            <Button variant="outline" onClick={next} disabled={sessionQueue.length <= 1}>
              Next
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="shrink-0">
        <Footer />
      </div>
    </div>
  );
}
