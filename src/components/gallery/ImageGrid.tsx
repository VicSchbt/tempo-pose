import { useStore } from '@/store';
import { Thumb } from './Thumb';
import { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { ConfirmDialog } from '../dialog/ConfirmDialog';

/**
 * Renders a responsive grid of image thumbnails from global state.
 * - A11y: role=list/listitem, alt text, focus styles.
 * - Performance: keyed items, <img loading="lazy">, React.memo for thumbs.
 * - Extensible: optional remove-all action slot.
 */
export default function ImageGrid() {
  const images = useStore((s) => s.images); // REQUIRED in your store
  const removeImage = useStore((s) => s.removeImage as (id: string) => void); // OPTIONAL
  const clearImages = useStore((s) => s.clearImages as () => void); // OPTIONAL

  const [open, setOpen] = useState(false);
  const clearBtnRef = useRef<HTMLButtonElement>(null);

  if (!images || images.length === 0) {
    return (
      <div
        className="mx-auto mt-6 w-full max-w-5xl rounded-2xl border border-dashed p-6 text-center text-neutral-600"
        role="status"
        aria-live="polite"
      >
        No images yet. Drop some files above to get started.
      </div>
    );
  }

  return (
    <section className="mx-auto mt-6 w-full max-w-5xl">
      <header className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-neutral-900">
          Gallery <span className="text-neutral-500">({images.length})</span>
        </h2>

        {typeof clearImages === 'function' && (
          <>
            <Button ref={clearBtnRef} variant="outline" onClick={() => setOpen(true)}>
              Clear all
            </Button>

            <ConfirmDialog
              open={open}
              onOpenChange={setOpen}
              title="Clear all images?"
              description="This will permanently remove all thumbnails from the gallery."
              confirmLabel="Yes, clear all"
              cancelLabel="Cancel"
              tone="danger"
              onConfirm={() => clearImages()}
              returnFocus={() => clearBtnRef.current?.focus()}
            />
          </>
        )}
      </header>

      <ul
        role="list"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      >
        {images.map((img) => (
          <Thumb
            key={img.id}
            img={img}
            onRemove={typeof removeImage === 'function' ? removeImage : undefined}
          />
        ))}
      </ul>
    </section>
  );
}
