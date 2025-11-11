import React from 'react';
import { X } from 'lucide-react';
import type { ImageItem } from '@/types/core';
import { Button } from '../ui/button';

type ThumbProps = {
  img: ImageItem;
  onRemove?: (id: string) => void;
  overlayLabel?: string;
  overlayAction?: () => void;
};

export const Thumb = React.memo(function Thumb({
  img,
  onRemove,
  overlayLabel,
  overlayAction,
}: ThumbProps) {
  const src = img.url;
  const label = img.name ?? 'Image';

  return (
    <li
      role="listitem"
      className="group relative overflow-hidden rounded-xl border bg-white shadow-sm focus-within:ring-2 focus-within:ring-offset-2"
    >
      {/* image */}
      <img
        src={src}
        alt={label}
        loading="lazy"
        className="h-36 w-full object-cover sm:h-40"
        draggable={false}
      />

      {/* filename overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="line-clamp-1 text-xs text-white/95">{label}</p>
      </div>

      {/* "+X more" overlay button */}
      {overlayLabel && overlayAction && (
        <button
          type="button"
          aria-label={`${overlayLabel} – show all thumbnails`}
          onClick={overlayAction}
          className="absolute inset-0 inline-flex items-center justify-center bg-black/45 text-white backdrop-blur-[1px] transition-colors hover:bg-black/55 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-neutral-900 shadow">
            {overlayLabel}
          </span>
        </button>
      )}

      {/* remove button */}
      {onRemove && (
        <Button
          className="absolute top-2 right-2 rounded-full"
          type="button"
          onClick={() => onRemove(img.id)}
          aria-label={`Remove ${label}`}
          variant="outline"
          size="icon"
        >
          <X className="h-4 w-4" aria-hidden />
        </Button>
      )}
    </li>
  );
});
