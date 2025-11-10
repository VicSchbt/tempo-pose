import { useStore } from '@/store';
import { nanoid } from 'nanoid';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  fileListToArray,
  formatBytes,
  makeAcceptPredicate,
  normalizeImages,
  validateFiles,
} from './ImageDrop.utils';
import { AlertCircle, Upload } from 'lucide-react';

type ImageDropProps = {
  /** Accept list for the file dialog & drag filter */
  accept?: string; // e.g. "image/*,.png,.jpg,.jpeg,.webp"
  /** Allow multiple selection */
  multiple?: boolean;
  /** Disable interactions */
  disabled?: boolean;
  /** Max file size in MB (default 10MB) */
  maxSizeMB?: number;
  /** Optional label text */
  label?: string;
  /** Optional test id / input id */
  id?: string;
  /** Extra classes for the container */
  className?: string;
  /** Optional callback to observe validation issues */
  onValidationIssues?: (messages: string[]) => void;
};

export default function ImageDrop({
  accept = 'image/*,.png,.jpg,.jpeg,.webp',
  multiple = true,
  disabled = false,
  maxSizeMB = 10,
  label = 'Drag & drop images here, or click to select',
  id = 'image-drop-input',
  className = '',
  onValidationIssues,
}: ImageDropProps) {
  const addImages = useStore((s) => s.addImages);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptPredicate = useMemo(() => makeAcceptPredicate(accept), [accept]);
  const maxBytes = useMemo(() => maxSizeMB * 1024 * 1024, [maxSizeMB]);

  const process = useCallback(
    (files: File[]) => {
      const { accepted, issues } = validateFiles(files, {
        acceptPredicate,
        maxBytes,
      });

      if (issues.length) {
        const messages = [
          ...new Set(
            issues.map((i) =>
              i.reason === 'size'
                ? `${i.message} Max allowed is ${formatBytes(maxBytes)}.`
                : i.message,
            ),
          ),
        ];
        setErrors(messages);
        onValidationIssues?.(messages);
      } else {
        setErrors([]);
      }

      if (accepted.length) {
        const imgs = normalizeImages(accepted, acceptPredicate, nanoid);
        if (imgs.length) addImages(imgs);
      }

      setIsDragging(false);
    },
    [acceptPredicate, addImages, maxBytes, onValidationIssues],
  );

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    process(fileListToArray(e.target.files));
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
    process(fileListToArray(e.dataTransfer.files));
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpenDialog();
    }
  };

  const hasErrors = errors.length > 0;

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
        aria-describedby={`${id}-hint ${id}-errors`}
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
            : hasErrors
              ? 'border-rose-400 bg-rose-50/40 ring-2 ring-rose-500/20'
              : isDragging
                ? 'border-blue-400 bg-blue-50/50 ring-2 ring-blue-500/30'
                : 'hover:border-neutral-400',
          className,
        ].join(' ')}
      >
        <Upload
          aria-hidden="true"
          className={[
            'mb-3 h-12 w-12 transition-transform',
            hasErrors
              ? 'text-rose-500'
              : isDragging
                ? 'scale-110 text-blue-500'
                : 'text-neutral-400',
          ].join(' ')}
        />
        <p className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">{label}</p>
        <p id={`${id}-hint`} className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {multiple ? 'Multiple files • ' : ''}
          Accepted: <code>{accept}</code> • Max size: {formatBytes(maxBytes)}
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
            opacity: hasErrors ? 0.12 : isDragging ? 0.12 : 0.06,
            color: hasErrors ? 'rgb(244 63 94)' : 'rgb(59 130 246)', // rose-500 / blue-500
          }}
        />

        {/* Live region for drag state (a11y) */}
        <span className="sr-only" aria-live="polite">
          {isDragging ? 'Drop files now' : 'Drop zone ready'}
        </span>
      </div>
      {/* Inline error list */}
      <div
        id={`${id}-errors`}
        role={hasErrors ? 'alert' : undefined}
        aria-live="assertive"
        className={['mx-auto mt-3 w-full max-w-3xl', hasErrors ? 'block' : 'hidden'].join(' ')}
      >
        {errors.map((msg, i) => (
          <div
            key={`${msg}-${i}`}
            className="mb-2 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-800"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-sm">{msg}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
