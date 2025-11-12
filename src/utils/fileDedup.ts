export type FileSignature = string;

/**
 * Compute a unique signature for a file using name + size + lastModified.
 */
export function getFileSignature(file: File): FileSignature {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

/**
 * Given a list of files, return only unique ones (dedupe by name+size+lastModified).
 */
export function dedupeFiles(files: File[]): File[] {
  const seen = new Set<FileSignature>();
  const unique: File[] = [];
  for (const f of files) {
    const sig = getFileSignature(f);
    if (!seen.has(sig)) {
      seen.add(sig);
      unique.push(f);
    }
  }
  return unique;
}
