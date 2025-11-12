type Task = { url: string };
type Listener = (url: string) => void;

/**
 *  A tiny image prefetch queue using new Image() with small concurrency.
 *  - Deduped by URL
 *  - Cancels pending work on clear()
 *  - Safe to call multiple times
 */
export class ImagePrefetchQueue {
  private readonly maxConcurrent: number;
  private readonly queue: Task[] = [];
  private readonly inflight = new Set<string>();
  private readonly done = new Set<string>();
  private onDone?: Listener;
  private destroyed = false;

  constructor(maxConcurrent = 2) {
    this.maxConcurrent = Math.max(1, maxConcurrent);
  }

  setOnDone(listener: Listener) {
    this.onDone = listener;
  }

  /** Enqueue a list of image URLs to prefetch (deduped). */
  enqueue(urls: string[]) {
    if (this.destroyed) return;
    for (const url of urls) {
      if (!url) continue;
      if (this.done.has(url)) continue;
      if (this.inflight.has(url)) continue;
      if (this.queue.find((t) => t.url === url)) continue;
      this.queue.push({ url });
    }
    this.tick();
  }

  /** Start workers up to concurrency limit. */
  private tick() {
    if (this.destroyed) return;
    while (this.inflight.size < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift()!;
      this.spawn(task);
    }
  }

  private spawn(task: Task) {
    if (this.destroyed) return;

    this.inflight.add(task.url);

    // Prefer idle time for starting decodes
    const start = (cb: () => void) =>
      (globalThis as any).requestIdleCallback
        ? (globalThis as any).requestIdleCallback(cb)
        : setTimeout(cb, 0);

    start(() => {
      if (this.destroyed) return;
      const img = new Image();
      const finalize = () => {
        if (this.destroyed) return;
        this.inflight.delete(task.url);
        this.done.add(task.url);
        this.onDone?.(task.url);
        this.tick();
      };
      img.onload = finalize;
      img.onerror = finalize;
      // Trigger prefetch
      img.decoding = 'async';
      img.loading = 'eager';
      img.src = task.url;
    });
  }

  /** Clear pending work and mark queue as destroyed. */
  clear() {
    this.destroyed = true;
    this.queue.length = 0;
    this.inflight.clear();
  }
}
