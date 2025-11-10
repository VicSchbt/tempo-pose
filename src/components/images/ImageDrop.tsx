import { useStore } from '@/store';
import { nanoid } from 'nanoid';
import { useCallback, useMemo, useRef, useState } from 'react';
import { fileListToArray, makeAcceptPredicate, normalizeImages } from './ImageDrop.utils';

type ImageDropProps = {
  /** Accept list for the file dialog & drag filter */
  accept?: string; // e.g. "image/*,.png,.jpg,.jpeg,.webp"
  /** Allow multiple selection */
  multiple?: boolean;
  /** Disable interactions */
  disabled?: boolean;
  /** Optional label text */
  label?: string;
  /** Optional test id / input id */
  id?: string;
  /** Extra classes for the container */
  className?: string;
};

export default function ImageDrop({
  accept = 'image/*,.png,.jpg,.jpeg,.webp',
  multiple = true,
  disabled = false,
  label = 'Drag & drop images here, or click to select',
  id = 'image-drop-input',
  className = '',
}: ImageDropProps) {
  const addImages = useStore((s) => s.addImages);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptPredicate = useMemo(() => makeAcceptPredicate(accept), [accept]);

  const emitImages = useCallback(
    (files: File[]) => {
      const imgs = normalizeImages(files, acceptPredicate, nanoid);
      if (imgs.length) addImages(imgs);
      setIsDragging(false);
    },
    [acceptPredicate, addImages],
  );

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    emitImages(fileListToArray(e.target.files));
    // let users reselect the same file(s)
    if (inputRef.current) inputRef.current.value = '';
  };

  const onOpenDialog = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  // Drag events
  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const onDragEnter: React.DragEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    // only reset when pointer leaves the component bounds
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    e.preventDefault();
    emitImages(fileListToArray(e.dataTransfer.files));
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpenDialog();
    }
  };
  return (
    <div className="w-full">
      {/* Hidden input kept for accessibility and click-to-open */}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={onInputChange}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-describedby={`${id}-hint`}
        onClick={onOpenDialog}
        onKeyDown={onKeyDown}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={[
          // base
          'rounded-2xl border border-dashed p-6 text-center transition-colors',
          'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          // state
          disabled
            ? 'cursor-not-allowed border-neutral-300 opacity-60'
            : isDragging
              ? 'border-blue-500 ring-2 ring-blue-500/30'
              : 'border-neutral-300 hover:border-neutral-400',
          className,
        ].join(' ')}
      >
        <p className="text-base font-medium">{label}</p>
        <p id={`${id}-hint`} className="text-muted-foreground mt-2 text-sm">
          {multiple ? 'Multiple files • ' : ''}
          Accepted: <code>{accept}</code>
        </p>

        {/* Live region for drag state (a11y) */}
        <span className="sr-only" aria-live="polite">
          {isDragging ? 'Drop files now' : 'Drop zone ready'}
        </span>
      </div>
    </div>
  );
}
