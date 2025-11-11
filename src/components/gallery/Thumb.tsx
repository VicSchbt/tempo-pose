import React from 'react';
import { X } from 'lucide-react';
import type { ImageItem } from '@/types/core';

type ThumbProps = {
  img: ImageItem;
  onRemove?: (id: string) => void;
};

export const Thumb = React.memo(function Thumb({ img, onRemove }: ThumbProps) {
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

      {/* remove button */}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(img.id)}
          className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 opacity-0 shadow-sm ring-1 ring-neutral-200 transition-opacity group-hover:opacity-100 hover:bg-white focus:opacity-100"
          aria-label={`Remove ${label}`}
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </li>
  );
});
