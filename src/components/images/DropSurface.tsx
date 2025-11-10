import { Upload, AlertCircle } from 'lucide-react';
import React from 'react';

type Props = {
  id: string;
  label: string;
  hint: string;
  state: 'idle' | 'drag' | 'error' | 'disabled';
  className?: string;
  onClick?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onDragOver?: React.DragEventHandler<HTMLDivElement>;
  onDragEnter?: React.DragEventHandler<HTMLDivElement>;
  onDragLeave?: React.DragEventHandler<HTMLDivElement>;
  onDrop?: React.DragEventHandler<HTMLDivElement>;
  children?: React.ReactNode; // for a11y live regions, etc.
};

export function DropSurface({
  id,
  label,
  hint,
  state,
  className = '',
  onClick,
  onKeyDown,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  children,
}: Props) {
  const isDisabled = state === 'disabled';
  const isError = state === 'error';
  const isDrag = state === 'drag';

  return (
    <div
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
      aria-describedby={`${id}-hint ${id}-errors`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={[
        // size & layout
        'relative mx-auto flex h-64 w-full max-w-3xl flex-col items-center justify-center p-4 sm:h-72',
        // visuals
        'rounded-3xl border-2 border-dashed bg-neutral-50 shadow-sm transition-all duration-300',
        // focus
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        // states
        isDisabled
          ? 'cursor-not-allowed border-neutral-300 opacity-60'
          : isError
            ? 'border-rose-400 bg-rose-50/40 ring-2 ring-rose-500/20'
            : isDrag
              ? 'border-blue-400 bg-blue-50/50 ring-2 ring-blue-500/30'
              : 'hover:border-neutral-400',
        className,
      ].join(' ')}
    >
      {isError ? (
        <AlertCircle aria-hidden className="mb-3 h-12 w-12 text-rose-500" />
      ) : (
        <Upload
          aria-hidden
          className={[
            'mb-3 h-12 w-12 transition-transform',
            isDrag ? 'scale-110 text-blue-500' : 'text-neutral-400',
          ].join(' ')}
        />
      )}

      <p className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">{label}</p>
      <p id={`${id}-hint`} className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        {hint}
      </p>

      {/* playful dotted overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          maskImage: 'radial-gradient(12px 12px at 12px 12px, transparent 10px, black 10px)',
          WebkitMaskImage: 'radial-gradient(12px 12px at 12px 12px, transparent 10px, black 10px)',
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          opacity: isError ? 0.12 : isDrag ? 0.12 : 0.06,
          color: isError ? 'rgb(244 63 94)' : 'rgb(59 130 246)', // rose-500 / blue-500
        }}
      />

      {children}
    </div>
  );
}
