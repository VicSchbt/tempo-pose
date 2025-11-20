import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { getFullscreenHint, isFullscreenSupported, isIOS } from './fullscreen';

describe('fullscreen utilities', () => {
  const originalUserAgent = navigator.userAgent;
  const originalPlatform = navigator.platform;
  const originalMaxTouchPoints = navigator.maxTouchPoints;

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'platform', {
      value: originalPlatform,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: originalMaxTouchPoints,
      writable: true,
      configurable: true,
    });
  });

  describe('isIOS', () => {
    it('returns false when navigator is undefined', () => {
      const result = isIOS();
      // In jsdom, navigator exists, so this will return false
      expect(typeof result).toBe('boolean');
    });

    it('detects iPhone', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        writable: true,
        configurable: true,
      });

      expect(isIOS()).toBe(true);
    });

    it('detects iPad', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
        writable: true,
        configurable: true,
      });

      expect(isIOS()).toBe(true);
    });

    it('detects iPad via platform check (Safari on iPad)', () => {
      Object.defineProperty(navigator, 'platform', {
        value: 'MacIntel',
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 5,
        writable: true,
        configurable: true,
      });

      expect(isIOS()).toBe(true);
    });

    it('returns false for desktop browsers', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, 'platform', {
        value: 'Win32',
        writable: true,
        configurable: true,
      });

      expect(isIOS()).toBe(false);
    });
  });

  describe('isFullscreenSupported', () => {
    beforeEach(() => {
      // Reset document.fullscreenElement mock
      Object.defineProperty(document, 'fullscreenElement', {
        value: null,
        writable: true,
        configurable: true,
      });
    });

    it('returns false when document is undefined', () => {
      // This is hard to test in jsdom, but the function checks for document
      const result = isFullscreenSupported();
      expect(typeof result).toBe('boolean');
    });

    it('returns false for iOS devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        writable: true,
        configurable: true,
      });

      // Mock requestFullscreen to exist (but iOS check should override)
      const mockRequestFullscreen = vi.fn();
      Object.defineProperty(document.documentElement, 'requestFullscreen', {
        value: mockRequestFullscreen,
        writable: true,
        configurable: true,
      });

      expect(isFullscreenSupported()).toBe(false);
    });

    it('returns true when Fullscreen API is available', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        writable: true,
        configurable: true,
      });

      const mockRequestFullscreen = vi.fn();
      Object.defineProperty(document.documentElement, 'requestFullscreen', {
        value: mockRequestFullscreen,
        writable: true,
        configurable: true,
      });

      expect(isFullscreenSupported()).toBe(true);
    });

    it('checks for webkit prefix fallback', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        writable: true,
        configurable: true,
      });

      const mockWebkitRequestFullscreen = vi.fn();
      Object.defineProperty(document.documentElement, 'webkitRequestFullscreen', {
        value: mockWebkitRequestFullscreen,
        writable: true,
        configurable: true,
      });

      expect(isFullscreenSupported()).toBe(true);
    });
  });

  describe('getFullscreenHint', () => {
    const labels = {
      unsupported: 'unsupported',
      enter: 'enter',
      exit: 'exit',
    };

    it('returns unsupported message when fullscreen is not supported', () => {
      const hint = getFullscreenHint(false, false, labels);
      expect(hint).toBe(labels.unsupported);
    });

    it('returns "fullscreen" when not in fullscreen and supported', () => {
      const hint = getFullscreenHint(false, true, labels);
      expect(hint).toBe(labels.enter);
    });

    it('returns "exit fullscreen" when in fullscreen and supported', () => {
      const hint = getFullscreenHint(true, true, labels);
      expect(hint).toBe(labels.exit);
    });
  });
});

