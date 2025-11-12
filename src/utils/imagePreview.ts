// Lightweight downscale + JPEG encode for thumbnails.
// Works with either a File (best) or an existing URL.
type PreviewOpts = {
  maxSize?: number; // longest edge (px)
  quality?: number; // 0..1 for JPEG/WebP
};

const fileCache = new WeakMap<File, string>(); // File -> preview blob URL
const urlCache = new Map<string, string>(); // original URL -> preview blob URL

export async function getPreviewURL(
  source: { file?: File; url: string },
  opts: PreviewOpts = {},
): Promise<string> {
  const maxSize = opts.maxSize ?? 512;
  const quality = opts.quality ?? 0.6;

  // 1) If we have the original File, cache by WeakMap
  if (source.file && fileCache.has(source.file)) {
    return fileCache.get(source.file)!;
  }
  if (!source.file && urlCache.has(source.url)) {
    return urlCache.get(source.url)!;
  }

  // 2) Load into an ImageBitmap efficiently (can resize at decode)
  let bitmap: ImageBitmap;
  if (source.file) {
    bitmap = await createImageBitmap(source.file);
  } else {
    const res = await fetch(source.url, { cache: 'force-cache' });
    const blob = await res.blob();
    bitmap = await createImageBitmap(blob);
  }

  // 3) Compute target size (keep aspect ratio)
  const scale = Math.min(maxSize / bitmap.width, maxSize / bitmap.height, 1);
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  // 4) Draw into a canvas at target size
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  // 5) Encode to JPEG (smaller/faster for photos)
  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Preview encoding failed'))),
      'image/jpeg',
      quality,
    ),
  );

  const url = URL.createObjectURL(blob);

  // 6) Cache
  if (source.file) fileCache.set(source.file, url);
  else urlCache.set(source.url, url);

  return url;
}

// Allow manual cleanup if you remove an image from the store.
export function revokePreviewURL(previewUrl: string) {
  URL.revokeObjectURL(previewUrl);
}
