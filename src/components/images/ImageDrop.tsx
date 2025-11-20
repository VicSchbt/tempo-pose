import { useStore } from '@/store';
import { nanoid } from 'nanoid';
import { useCallback, useMemo, useRef } from 'react';
import {
  fileListToArray,
  formatBytes,
  makeAcceptPredicate,
  normalizeImages,
  validateFiles,
} from './ImageDrop.utils';
import { DropSurface } from './DropSurface';
import { useDragDrop } from './useDragDrop';
import { toast } from 'sonner';
import { dedupeFiles } from '@/utils/fileDedup';
import { useTranslation } from '@/i18n/TranslationProvider';

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
  label,
  id = 'image-drop-input',
  className = '',
  onValidationIssues,
}: ImageDropProps) {
  const addImages = useStore((s) => s.addImages);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const acceptPredicate = useMemo(() => makeAcceptPredicate(accept), [accept]);
  const maxBytes = useMemo(() => maxSizeMB * 1024 * 1024, [maxSizeMB]);

  // Unified “process files” function (used by both DnD and input)
  const process = useCallback(
    (files: File[]) => {
      // 🧩 1. Deduplicate
      const uniqueFiles = dedupeFiles(files);
      const duplicatesCount = files.length - uniqueFiles.length;

      // 🧩 2. Warn user if any duplicate found
      if (duplicatesCount > 0) {
        const key = duplicatesCount === 1 ? 'toasts.duplicateSingle' : 'toasts.duplicatePlural';
        toast.info(t(key, { count: duplicatesCount }), {
          duration: 4000,
          position: 'top-right',
        });
      }

      // 🧩 3. Continue with your existing validation
      const { accepted, issues } = validateFiles(uniqueFiles, {
        acceptPredicate,
        maxBytes,
      });

      if (issues.length) {
        const messages = [
          ...new Set(
            issues.map((issue) =>
              issue.reason === 'size'
                ? t('toasts.validationSize', {
                    file: issue.file.name,
                    size: formatBytes(issue.file.size),
                  })
                : t('toasts.validationType', { file: issue.file.name }),
            ),
          ),
        ];

        messages.slice(0, 5).forEach((msg) => {
          toast.error(msg, {
            duration: 5000,
            position: 'top-right',
          });
        });

        if (messages.length > 5) {
          toast.error(
            t('toasts.validationOverflow', {
              count: messages.length - 5,
            }),
            {
              duration: 4000,
              position: 'top-right',
            },
          );
        }

        onValidationIssues?.(messages);
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
        label={label ?? t('images.drop.label')}
        hint={
          multiple
            ? t('images.drop.hintMultiple', { accept, size: formatBytes(maxBytes) })
            : t('images.drop.hintSingle', { accept, size: formatBytes(maxBytes) })
        }
        state={disabled ? 'disabled' : drag.isDragging ? 'drag' : 'idle'}
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
          {drag.isDragging ? t('images.drop.dropNow') : t('images.drop.ready')}
        </span>
      </DropSurface>
    </div>
  );
}
