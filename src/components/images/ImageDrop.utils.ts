// Pure helpers for ImageDrop — easy to unit-test, no React imports.

/** Convert a FileList to a real array */
export function fileListToArray(list: FileList | null): File[] {
  return list ? Array.from(list) : [];
}

/**
 * Build a predicate from an accept string.
 * Supports: "image/*", exact mimes ("image/png"), and extensions (".png").
 */
export function makeAcceptPredicate(accept?: string) {
  if (!accept) return () => true;
  const tokens = accept
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  return (file: File) => {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();

    return tokens.some((t) => {
      if (t.endsWith('/*')) return type.startsWith(t.slice(0, -1)); // keep slash
      if (t.startsWith('.')) return name.endsWith(t);
      return type === t; // exact mime
    });
  };
}

/**
 * Normalize image files into your app’s image model:
 * { id, url, name } — URL is created via createObjectURL.
 * The `idFactory` allows deterministic testing or swapping nanoid.
 */
export function normalizeImages(
  files: File[],
  acceptPredicate: (f: File) => boolean,
  idFactory: () => string,
) {
  return files
    .filter((f) => f.type.startsWith('image/') && acceptPredicate(f))
    .map((f) => ({
      id: idFactory(),
      url: URL.createObjectURL(f),
      name: f.name,
    }));
}
