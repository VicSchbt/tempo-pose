// Pure helpers for ImageDrop — no React imports.

import type { ImageItem } from '@/types/core';

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

/** Human readable file size */
export function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${sizes[i]}`;
}

export type FileValidationIssue = {
  file: File;
  reason: 'type' | 'size';
  message: string;
};

/**
 * Validate files by accept predicate and max size.
 * Returns { accepted, issues[] } where issues carries message per rejected file.
 */
export function validateFiles(
  files: File[],
  opts: {
    acceptPredicate: (f: File) => boolean;
    maxBytes: number;
  },
) {
  const accepted: File[] = [];
  const issues: FileValidationIssue[] = [];

  for (const f of files) {
    if (!opts.acceptPredicate(f) || !f.type.startsWith('image/')) {
      issues.push({
        file: f,
        reason: 'type',
        message: `${f.name} is not a supported image type.`,
      });
      continue;
    }
    if (f.size > opts.maxBytes) {
      issues.push({
        file: f,
        reason: 'size',
        message: `${f.name} is too large (${formatBytes(f.size)}).`,
      });
      continue;
    }
    accepted.push(f);
  }

  return { accepted, issues };
}

/**
 * Normalize image files into your app’s image model:
 * { id, url, name } — URL is created via createObjectURL.
 */

export function normalizeImages(
  files: File[],
  acceptPredicate: (f: File) => boolean,
  idFactory: () => string,
): ImageItem[] {
  return files
    .filter((f) => f.type.startsWith('image/') && acceptPredicate(f))
    .map((f) => ({
      id: idFactory(),
      name: f.name,
      url: URL.createObjectURL(f),
      file: f,
      status: 'ok',
    }));
}
