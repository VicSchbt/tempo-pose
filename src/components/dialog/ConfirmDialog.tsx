import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/TranslationProvider';

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'neutral';
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  /** (Optional) The element that opened the dialog; we’ll return focus there on close */
  returnFocus?: () => void;
};

/**
 * A small wrapper around shadcn/ui Dialog to confirm destructive actions.
 * - a11y: focus trap, ESC, proper roles/labels via shadcn
 * - keyboard: Enter on confirm button, ESC or dedicated close to cancel
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = 'danger',
  onConfirm,
  onOpenChange,
  returnFocus,
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t('dialogs.confirm.title');
  const resolvedDescription = description ?? t('dialogs.confirm.description');
  const resolvedConfirmLabel = confirmLabel ?? t('dialogs.confirm.confirm');
  const resolvedCancelLabel = cancelLabel ?? t('dialogs.confirm.cancel');

  // Restore focus to trigger after closing
  React.useEffect(() => {
    if (!open) returnFocus?.();
  }, [open, returnFocus]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle
              aria-hidden
              className={
                tone === 'danger' ? 'text-destructive h-5 w-5' : 'text-muted-foreground h-5 w-5'
              }
            />
            <DialogTitle className="leading-none">{resolvedTitle}</DialogTitle>
          </div>
          <DialogDescription>{resolvedDescription}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">{resolvedCancelLabel}</Button>
          </DialogClose>

          <Button
            variant={tone === 'danger' ? 'destructive' : 'default'}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {resolvedConfirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
