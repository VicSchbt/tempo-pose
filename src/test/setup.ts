import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window focus/blur events for tests
Object.defineProperty(window, 'focus', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(window, 'blur', {
  value: vi.fn(),
  writable: true,
});

// Mock document.hasFocus
Object.defineProperty(document, 'hasFocus', {
  value: vi.fn(() => true),
  writable: true,
});

// Mock fullscreen API
Object.defineProperty(document, 'fullscreenElement', {
  value: null,
  writable: true,
  configurable: true,
});

Object.defineProperty(document, 'exitFullscreen', {
  value: vi.fn(() => Promise.resolve()),
  writable: true,
  configurable: true,
});

HTMLElement.prototype.requestFullscreen = vi.fn(function (this: HTMLElement) {
  Object.defineProperty(document, 'fullscreenElement', {
    value: this,
    writable: true,
    configurable: true,
  });
  return Promise.resolve();
});

