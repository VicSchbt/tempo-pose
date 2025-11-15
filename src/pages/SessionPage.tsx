import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
      <div className="flex min-h-svh flex-col items-center justify-center gap-4">
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
      <div className="flex min-h-svh flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">Image not found</p>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <div className="border-border bg-background sticky top-0 z-50 border-b">
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

      <main className="mx-auto max-w-5xl flex-1 px-4 py-8">
        <div className="space-y-6">
          {/* Progress indicator */}
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

          {/* Current image */}
          <figure className="mx-auto max-w-3xl">
            <img
              src={currentImage.url}
              alt={currentImage.name ?? 'Reference image'}
              className="h-auto w-full rounded"
            />
            <figcaption className="text-muted-foreground mt-2 text-center text-sm">
              {currentImage.name ?? 'Image'}
            </figcaption>
          </figure>

          {/* Navigation controls */}
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
    </div>
  );
}
