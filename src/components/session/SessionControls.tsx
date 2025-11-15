// /src/components/session/SessionControls.tsx
import { useStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SessionControls() {
  const navigate = useNavigate();
  const images = useStore((s) => s.images);
  const startSession = useStore((s) => s.startSession);

  const handleStart = () => {
    // TEMPO-35: On Start: derive queue from current images; guard empty state
    const success = startSession(images);

    if (!success) {
      toast.error('Please add at least one image before starting a session');
      return;
    }

    // Navigate to session page
    navigate('/session');
  };

  return (
    <section aria-label="Session controls" className="flex w-full flex-col gap-3">
      <header className="flex items-center justify-between gap-2">
        <h2 id="session-section-title" className="text-xl font-semibold">
          Session
        </h2>
      </header>
      <Button onClick={handleStart} size="lg" className="w-full">
        Start Session
      </Button>
    </section>
  );
}
