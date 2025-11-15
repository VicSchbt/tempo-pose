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
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  onConfirm,
  onOpenChange,
  returnFocus,
}: ConfirmDialogProps) {
  const confirmBtnClass =
    tone === 'danger' ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-600 text-white' : '';

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
              className={tone === 'danger' ? 'h-5 w-5 text-red-600' : 'h-5 w-5 text-neutral-600'}
            />
            <DialogTitle className="leading-none">{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">{cancelLabel}</Button>
          </DialogClose>

          <Button
            className={confirmBtnClass}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
