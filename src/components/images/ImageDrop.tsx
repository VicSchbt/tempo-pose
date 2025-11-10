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
import { DropSurface } from './DropSurface';
import { useDragDrop } from './useDragDrop';

type ImageDropProps = {
  accept?: string; // e.g. "image/*,.png,.jpg,.jpeg,.webp"
  multiple?: boolean;
  disabled?: boolean;
  maxSizeMB?: number; // default 10
  label?: string;
  id?: string;
  className?: string;
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const acceptPredicate = useMemo(() => makeAcceptPredicate(accept), [accept]);
  const maxBytes = useMemo(() => maxSizeMB * 1024 * 1024, [maxSizeMB]);

  // Unified “process files” function (used by both DnD and input)
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
    },
    [acceptPredicate, addImages, maxBytes, onValidationIssues],
  );

  // Hook: handles drag state + forwards files back to `process`
  const drag = useDragDrop(disabled, (fs) => process(fileListToArray(fs)));
  const hasErrors = errors.length > 0;

  const openDialog = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    process(fileListToArray(e.target.files));
    if (inputRef.current) inputRef.current.value = ''; // allow re-pick same file
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

      <DropSurface
        id={id}
        label={label}
        hint={`${multiple ? 'Multiple files • ' : ''}Accepted: ${accept} • Max size: ${formatBytes(maxBytes)}`}
        state={disabled ? 'disabled' : hasErrors ? 'error' : drag.isDragging ? 'drag' : 'idle'}
        className={className}
        onClick={openDialog}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openDialog();
          }
        }}
        onDragOver={drag.onDragOver}
        onDragEnter={drag.onDragEnter}
        onDragLeave={drag.onDragLeave}
        onDrop={drag.onDrop}
      >
        {/* a11y live region */}
        <span className="sr-only" aria-live="polite">
          {drag.isDragging ? 'Drop files now' : 'Drop zone ready'}
        </span>
      </DropSurface>

      {/* Inline errors */}
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
            <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
              />
            </svg>
            <p className="text-sm">{msg}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
