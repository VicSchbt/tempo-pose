import { useEffect, useMemo } from 'react';
import { ImagePrefetchQueue } from '@/utils/imagePrefetch';

/**
 * React hook to prefetch a list of image URLs with a small queue.
 * - Stable across renders
 * - Cleans up on unmount
 */
export function useImagePrefetch(urls: string[], opts?: { concurrency?: number; limit?: number }) {
  const { concurrency = 2, limit = 10 } = opts ?? {};

  // Limit how many future images we prefetch (avoid network flood)
  const planned = useMemo(() => urls.filter(Boolean).slice(0, limit), [urls, limit]);

  useEffect(() => {
    if (planned.length === 0) return;
    const q = new ImagePrefetchQueue(concurrency);
    q.enqueue(planned);
    return () => q.clear();
  }, [planned, concurrency]);
}
