import { useCallback, useState } from 'react';

export type DragHandlers = {
  isDragging: boolean;
  onDragOver: React.DragEventHandler<HTMLDivElement>;
  onDragEnter: React.DragEventHandler<HTMLDivElement>;
  onDragLeave: React.DragEventHandler<HTMLDivElement>;
  onDrop: React.DragEventHandler<HTMLDivElement>;
};

export function useDragDrop(
  disabled: boolean,
  onFiles: (files: FileList | null) => void,
): DragHandlers {
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver: React.DragEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (disabled) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    },
    [disabled],
  );

  const onDragEnter: React.DragEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
    },
    [disabled],
  );

  const onDragLeave: React.DragEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (disabled) return;
      if (e.currentTarget.contains(e.relatedTarget as Node)) return;
      setIsDragging(false);
    },
    [disabled],
  );

  const onDrop: React.DragEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (disabled) return;
      e.preventDefault();
      onFiles(e.dataTransfer.files);
      setIsDragging(false);
    },
    [disabled, onFiles],
  );

  return { isDragging, onDragOver, onDragEnter, onDragLeave, onDrop };
}
