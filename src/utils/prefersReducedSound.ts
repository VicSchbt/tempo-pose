/**
 * Detects if the user's operating system has "reduce sound" or similar
 * accessibility preference enabled.
 *
 * Note: `prefers-reduced-sound` is not yet a standard CSS media query,
 * but we check for it anyway for future compatibility. We also check
 * for `prefers-reduced-motion` as a fallback, since users who prefer
 * reduced motion often also prefer reduced sound.
 *
 * @returns true if the user prefers reduced sound, false otherwise
 */
export function prefersReducedSound(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }

  // Check for prefers-reduced-sound (experimental/future standard)
  const prefersReducedSoundQuery = window.matchMedia('(prefers-reduced-sound: reduce)');
  if (prefersReducedSoundQuery.matches) {
    return true;
  }

  // Fallback: Check for prefers-reduced-motion
  // Users who prefer reduced motion often also prefer reduced sound
  const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotionQuery.matches) {
    return true;
  }

  return false;
}
