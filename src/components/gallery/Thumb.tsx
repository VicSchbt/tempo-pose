import React, { useEffect, useMemo, useState } from 'react';
import { ImageOff, X } from 'lucide-react';
import type { ImageItem } from '@/types/core';
import { Button } from '../ui/button';
import { getPreviewURL, revokePreviewURL } from '@/utils/imagePreview';

type ThumbProps = {
  img: ImageItem;
  onRemove?: (id: string) => void;
  overlayLabel?: string;
  overlayAction?: () => void;
  /**
   * Optional callback when the image fails to load.
   * You can use this to mark the image as "invalid" in your store.
   */
  onBroken?: (id: string) => void;
};

export const Thumb = React.memo(function Thumb({
  img,
  onRemove,
  overlayLabel,
  overlayAction,
  onBroken,
}: ThumbProps) {
  const label = img.name ?? 'Image';
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const [isBroken, setIsBroken] = useState(false);

  const previewKey = useMemo(() => `${img.id}:${img.url}`, [img.id, img.url]);

  useEffect(() => {
    let cancelled = false;
    let createdUrl: string | null = null;

    setIsBroken(false);

    (async () => {
      try {
        const url = await getPreviewURL(
          { file: (img as any).file, url: img.url },
          { maxSize: 512, quality: 0.6 },
        );
        if (!cancelled) {
          setPreviewSrc(url);
          createdUrl = url;
        }
      } catch {
        // if preview fails, fall back to original
        if (!cancelled) setPreviewSrc(img.url);
      }
    })();

    return () => {
      cancelled = true;
      if (createdUrl && createdUrl !== img.url) {
        revokePreviewURL(createdUrl);
      }
    };
    // re-run only if the image changes
  }, [previewKey]);

  const src = previewSrc ?? img.url;

  const handleError: React.ReactEventHandler<HTMLImageElement> = () => {
    if (isBroken) return; // avoid double-calls
    setIsBroken(true);
    onBroken?.(img.id);
  };

  // 🔴 BROKEN IMAGE UI
  if (isBroken) {
    return (
      <li
        role="listitem"
        className="group border-destructive/40 bg-destructive/5 relative flex h-36 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border p-3 text-center shadow-sm focus-within:ring-2 focus-within:ring-offset-2"
      >
        <ImageOff className="text-destructive h-6 w-6" aria-hidden="true" />

        <p className="text-destructive line-clamp-1 px-2 text-xs font-medium">
          Failed to load image
        </p>

        <p className="text-destructive/80 line-clamp-1 px-2 text-[11px]" title={label}>
          {label}
        </p>

        <div className="mt-1 flex gap-2">
          {onRemove && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs"
              onClick={() => onRemove(img.id)}
            >
              Remove
            </Button>
          )}
        </div>
      </li>
    );
  }

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
        onError={handleError}
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
