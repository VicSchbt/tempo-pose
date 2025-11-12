import { useStore } from '@/store';
import { Thumb } from './Thumb';
import { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { ConfirmDialog } from '../dialog/ConfirmDialog';
import { useResponsiveColumns } from '@/hooks/useResponsiveColumns';
import { ChevronUp } from 'lucide-react';
import { CountBadge } from '../count-badge/CountBadge';

/**
 * Collapsible first row:
 * - Collapsed: show at most N columns; last tile shows "+X" overlay if more.
 * - Expanded: show all; show "Hide" button at the end.
 * Also keeps your existing "Clear all" with confirmation.
 */
export default function ImageGrid() {
  const images = useStore((s) => s.images); // REQUIRED in your store
  const removeImage = useStore((s) => s.removeImage as (id: string) => void); // OPTIONAL
  const clearImages = useStore((s) => s.clearImages as () => void); // OPTIONAL

  const cols = useResponsiveColumns();
  const [expanded, setExpanded] = useState(false);

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

  const total = images.length;
  const canCollapse = total > cols; // only if we overflow the first row
  const visibleWhenCollapsed = Math.max(0, cols); // we keep exactly one row
  const remaining = Math.max(0, total - visibleWhenCollapsed);

  const visible = expanded || !canCollapse ? images : images.slice(0, visibleWhenCollapsed);

  return (
    <section className="mx-auto mt-6 w-full max-w-5xl">
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-neutral-900">Gallery</h2>
          {/* Total images */}
          <CountBadge
            count={total}
            ariaLabel={`Total images: ${total}`}
            title={`${total} image${total > 1 ? 's' : ''}`}
            variant="secondary"
          />
        </div>

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
        {visible.map((img, idx) => {
          const isLastVisibleAndCollapsed = !expanded && canCollapse && idx === visible.length - 1;

          return (
            <Thumb
              key={img.id}
              img={img}
              onRemove={typeof removeImage === 'function' ? removeImage : undefined}
              overlayLabel={isLastVisibleAndCollapsed ? `+${remaining} more` : undefined}
              overlayAction={isLastVisibleAndCollapsed ? () => setExpanded(true) : undefined}
            />
          );
        })}
        {expanded && canCollapse && (
          <li
            role="listitem"
            className="group relative flex items-center justify-center overflow-hidden rounded-xl border bg-neutral-100 shadow-sm transition focus-within:ring-2 focus-within:ring-offset-2 hover:bg-neutral-200"
          >
            <Button
              variant="outline"
              onClick={() => setExpanded(false)}
              aria-label="Hide extra thumbnails"
              className="flex h-full w-full flex-col items-center justify-center"
            >
              <ChevronUp />
              <span className="text-sm font-medium">Hide</span>
            </Button>
          </li>
        )}
      </ul>
    </section>
  );
}
