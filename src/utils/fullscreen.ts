/**
 * Detects if the device is iOS (iPhone, iPad, iPod)
 */
export function isIOS(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/**
 * Checks if the Fullscreen API is supported in the current browser
 */
export function isFullscreenSupported(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  // iOS Safari doesn't support the standard Fullscreen API
  if (isIOS()) {
    return false;
  }

  // Check for standard Fullscreen API support
  return Boolean(
    document.documentElement.requestFullscreen ||
      (document.documentElement as any).webkitRequestFullscreen ||
      (document.documentElement as any).mozRequestFullScreen ||
      (document.documentElement as any).msRequestFullscreen,
  );
}

/**
 * Gets the appropriate fullscreen hint text based on platform support
 */
export type FullscreenHintLabels = {
  unsupported: string;
  enter: string;
  exit: string;
};

export function getFullscreenHint(
  isFullscreen: boolean,
  isSupported: boolean,
  labels: FullscreenHintLabels,
): string {
  if (!isSupported) {
    return labels.unsupported;
  }

  return isFullscreen ? labels.exit : labels.enter;
}
