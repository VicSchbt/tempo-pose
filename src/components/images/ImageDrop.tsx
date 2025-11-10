import { useStore } from '@/store';
import { nanoid } from 'nanoid';
import { useCallback, useMemo, useRef, useState } from 'react';
import { fileListToArray, makeAcceptPredicate, normalizeImages } from './ImageDrop.utils';
import { Upload } from 'lucide-react';

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
          // size & layout
          'mx-auto flex h-64 w-full max-w-3xl flex-col items-center justify-center p-4 sm:h-72',
          // visuals
          'rounded-3xl border-2 border-dashed bg-neutral-50',
          'shadow-sm transition-all duration-300',
          // focus
          'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          // states
          disabled
            ? 'cursor-not-allowed border-neutral-300 opacity-60'
            : isDragging
              ? 'border-blue-400 bg-blue-50/50 ring-2 ring-blue-500/30'
              : 'hover:border-neutral-400',
          // dark mode (if you enable it later)
          'dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-900/80 dark:text-neutral-100 dark:hover:border-neutral-500',
          className,
        ].join(' ')}
      >
        <Upload
          aria-hidden="true"
          className={[
            'mb-3 h-12 w-12 transition-transform',
            isDragging ? 'scale-110 text-blue-500' : 'text-neutral-400',
          ].join(' ')}
        />
        <p className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">{label}</p>
        <p id={`${id}-hint`} className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {multiple ? 'Multiple files • ' : ''}
          Accepted: <code>{accept}</code>
        </p>

        {/* subtle dotted background for a playful feel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            maskImage: 'radial-gradient(12px 12px at 12px 12px, transparent 10px, black 10px)',
            WebkitMaskImage:
              'radial-gradient(12px 12px at 12px 12px, transparent 10px, black 10px)',
            backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            opacity: isDragging ? 0.12 : 0.06,
            color: 'rgb(59 130 246)', // tailwind blue-500; only affects decorative dots
          }}
        />

        {/* Live region for drag state (a11y) */}
        <span className="sr-only" aria-live="polite">
          {isDragging ? 'Drop files now' : 'Drop zone ready'}
        </span>
      </div>
    </div>
  );
}
