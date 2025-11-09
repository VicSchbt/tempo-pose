// /src/components/session/SessionControls.tsx
import { useStore } from '@/store';

export default function SessionControls() {
  const status = useStore((s) => s.status);
  const start = useStore((s) => s.start);
  const pause = useStore((s) => s.pause);
  const resume = useStore((s) => s.resume);
  const stop = useStore((s) => s.stop);
  const next = useStore((s) => s.next);

  return (
    <div className="flex gap-2">
      {status === 'idle' && (
        <button className="rounded border px-3 py-1" onClick={start}>
          Start
        </button>
      )}
      {status === 'running' && (
        <>
          <button className="rounded border px-3 py-1" onClick={pause}>
            Pause
          </button>
          <button className="rounded border px-3 py-1" onClick={next}>
            Next
          </button>
          <button className="rounded border px-3 py-1" onClick={stop}>
            Stop
          </button>
        </>
      )}
      {status === 'paused' && (
        <>
          <button className="rounded border px-3 py-1" onClick={resume}>
            Resume
          </button>
          <button className="rounded border px-3 py-1" onClick={stop}>
            Stop
          </button>
        </>
      )}
    </div>
  );
}
