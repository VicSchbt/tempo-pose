import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { prefersReducedSound } from './prefersReducedSound';

describe('prefersReducedSound', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    // Reset matchMedia mock
    window.matchMedia = vi.fn();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it('returns false when window.matchMedia is not available', () => {
    // @ts-expect-error - Testing undefined case
    delete window.matchMedia;

    expect(prefersReducedSound()).toBe(false);
  });

  it('returns true when prefers-reduced-sound is enabled', () => {
    window.matchMedia = vi.fn((query: string) => {
      if (query === '(prefers-reduced-sound: reduce)') {
        return { matches: true } as MediaQueryList;
      }
      return { matches: false } as MediaQueryList;
    });

    expect(prefersReducedSound()).toBe(true);
  });

  it('returns true when prefers-reduced-motion is enabled (fallback)', () => {
    window.matchMedia = vi.fn((query: string) => {
      if (query === '(prefers-reduced-motion: reduce)') {
        return { matches: true } as MediaQueryList;
      }
      return { matches: false } as MediaQueryList;
    });

    expect(prefersReducedSound()).toBe(true);
  });

  it('returns false when neither preference is enabled', () => {
    window.matchMedia = vi.fn(() => {
      return { matches: false } as MediaQueryList;
    });

    expect(prefersReducedSound()).toBe(false);
  });

  it('prioritizes prefers-reduced-sound over prefers-reduced-motion', () => {
    let callCount = 0;
    window.matchMedia = vi.fn((query: string) => {
      callCount++;
      if (query === '(prefers-reduced-sound: reduce)') {
        return { matches: true } as MediaQueryList;
      }
      // Should not reach this if prefers-reduced-sound matches
      if (query === '(prefers-reduced-motion: reduce)') {
        return { matches: true } as MediaQueryList;
      }
      return { matches: false } as MediaQueryList;
    });

    const result = prefersReducedSound();

    expect(result).toBe(true);
    // Should only check prefers-reduced-sound, not prefers-reduced-motion
    expect(callCount).toBe(1);
  });

  it('checks prefers-reduced-motion when prefers-reduced-sound is not enabled', () => {
    let queries: string[] = [];
    window.matchMedia = vi.fn((query: string) => {
      queries.push(query);
      if (query === '(prefers-reduced-sound: reduce)') {
        return { matches: false } as MediaQueryList;
      }
      if (query === '(prefers-reduced-motion: reduce)') {
        return { matches: true } as MediaQueryList;
      }
      return { matches: false } as MediaQueryList;
    });

    const result = prefersReducedSound();

    expect(result).toBe(true);
    expect(queries).toContain('(prefers-reduced-sound: reduce)');
    expect(queries).toContain('(prefers-reduced-motion: reduce)');
  });
});

