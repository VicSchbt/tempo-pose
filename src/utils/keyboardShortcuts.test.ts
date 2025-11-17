import { describe, expect, it, vi } from 'vitest';
import {
  handleKeyboardShortcut,
  isButtonLikeElement,
  isEditableElement,
  type ShortcutBinding,
} from './keyboardShortcuts';

describe('isEditableElement', () => {
  it('returns false for null element', () => {
    expect(isEditableElement(null)).toBe(false);
  });

  it('returns true for INPUT element', () => {
    const input = document.createElement('input');
    expect(isEditableElement(input)).toBe(true);
  });

  it('returns true for TEXTAREA element', () => {
    const textarea = document.createElement('textarea');
    expect(isEditableElement(textarea)).toBe(true);
  });

  it('returns true for SELECT element', () => {
    const select = document.createElement('select');
    expect(isEditableElement(select)).toBe(true);
  });

  it('returns true for contentEditable element', () => {
    const div = document.createElement('div');
    // jsdom may not fully support contentEditable, so we test the attribute approach
    div.setAttribute('contenteditable', 'true');
    // Manually set the property for jsdom compatibility
    Object.defineProperty(div, 'isContentEditable', {
      value: true,
      writable: true,
      configurable: true,
    });
    expect(isEditableElement(div)).toBe(true);
  });

  it('returns false for non-editable element', () => {
    const div = document.createElement('div');
    // Ensure isContentEditable is false
    Object.defineProperty(div, 'isContentEditable', {
      value: false,
      writable: true,
      configurable: true,
    });
    expect(isEditableElement(div)).toBe(false);
  });
});

describe('isButtonLikeElement', () => {
  it('returns false for null element', () => {
    expect(isButtonLikeElement(null)).toBe(false);
  });

  it('returns true for BUTTON element', () => {
    const button = document.createElement('button');
    expect(isButtonLikeElement(button)).toBe(true);
  });

  it('returns true for element with role="button"', () => {
    const div = document.createElement('div');
    div.setAttribute('role', 'button');
    expect(isButtonLikeElement(div)).toBe(true);
  });

  it('returns false for element without button role', () => {
    const div = document.createElement('div');
    expect(isButtonLikeElement(div)).toBe(false);
  });

  it('returns false for element with different role', () => {
    const div = document.createElement('div');
    div.setAttribute('role', 'link');
    expect(isButtonLikeElement(div)).toBe(false);
  });
});

describe('handleKeyboardShortcut', () => {
  it('does nothing when target is editable element', () => {
    const input = document.createElement('input');
    const action = vi.fn();
    const codeShortcutMap = new Map<string, ShortcutBinding>([
      ['Space', { action, preventDefault: true }],
    ]);
    const keyShortcutMap = new Map<string, ShortcutBinding>();

    const event = new KeyboardEvent('keydown', {
      code: 'Space',
      key: ' ',
      bubbles: true,
    });
    Object.defineProperty(event, 'target', { value: input, writable: false });

    handleKeyboardShortcut(event, codeShortcutMap, keyShortcutMap);

    expect(action).not.toHaveBeenCalled();
  });

  it('calls action when shortcut matches code', () => {
    const div = document.createElement('div');
    const action = vi.fn();
    const codeShortcutMap = new Map<string, ShortcutBinding>([
      ['Space', { action, preventDefault: true }],
    ]);
    const keyShortcutMap = new Map<string, ShortcutBinding>();

    const event = new KeyboardEvent('keydown', {
      code: 'Space',
      key: ' ',
      bubbles: true,
    });
    Object.defineProperty(event, 'target', { value: div, writable: false });

    handleKeyboardShortcut(event, codeShortcutMap, keyShortcutMap);

    expect(action).toHaveBeenCalledOnce();
  });

  it('calls action when shortcut matches key (lowercase)', () => {
    const div = document.createElement('div');
    const action = vi.fn();
    const codeShortcutMap = new Map<string, ShortcutBinding>();
    const keyShortcutMap = new Map<string, ShortcutBinding>([
      ['n', { action, preventDefault: true }],
    ]);

    const event = new KeyboardEvent('keydown', {
      code: 'KeyN',
      key: 'n',
      bubbles: true,
    });
    Object.defineProperty(event, 'target', { value: div, writable: false });

    handleKeyboardShortcut(event, codeShortcutMap, keyShortcutMap);

    expect(action).toHaveBeenCalledOnce();
  });

  it('prefers code over key when both match', () => {
    const div = document.createElement('div');
    const codeAction = vi.fn();
    const keyAction = vi.fn();
    const codeShortcutMap = new Map<string, ShortcutBinding>([
      ['Space', { action: codeAction, preventDefault: true }],
    ]);
    const keyShortcutMap = new Map<string, ShortcutBinding>([
      [' ', { action: keyAction, preventDefault: true }],
    ]);

    const event = new KeyboardEvent('keydown', {
      code: 'Space',
      key: ' ',
      bubbles: true,
    });
    Object.defineProperty(event, 'target', { value: div, writable: false });

    handleKeyboardShortcut(event, codeShortcutMap, keyShortcutMap);

    expect(codeAction).toHaveBeenCalledOnce();
    expect(keyAction).not.toHaveBeenCalled();
  });

  it('prevents default when preventDefault is true', () => {
    const div = document.createElement('div');
    const action = vi.fn();
    const codeShortcutMap = new Map<string, ShortcutBinding>([
      ['Space', { action, preventDefault: true }],
    ]);
    const keyShortcutMap = new Map<string, ShortcutBinding>();

    const event = new KeyboardEvent('keydown', {
      code: 'Space',
      key: ' ',
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, 'target', { value: div, writable: false });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    handleKeyboardShortcut(event, codeShortcutMap, keyShortcutMap);

    expect(preventDefaultSpy).toHaveBeenCalledOnce();
  });

  it('does not prevent default when preventDefault is false', () => {
    const div = document.createElement('div');
    const action = vi.fn();
    const codeShortcutMap = new Map<string, ShortcutBinding>([
      ['Space', { action, preventDefault: false }],
    ]);
    const keyShortcutMap = new Map<string, ShortcutBinding>();

    const event = new KeyboardEvent('keydown', {
      code: 'Space',
      key: ' ',
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, 'target', { value: div, writable: false });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    handleKeyboardShortcut(event, codeShortcutMap, keyShortcutMap);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('respects shouldIgnoreTarget callback', () => {
    const button = document.createElement('button');
    const action = vi.fn();
    const shouldIgnoreTarget = vi.fn(() => true);
    const codeShortcutMap = new Map<string, ShortcutBinding>([
      ['Space', { action, preventDefault: true, shouldIgnoreTarget }],
    ]);
    const keyShortcutMap = new Map<string, ShortcutBinding>();

    const event = new KeyboardEvent('keydown', {
      code: 'Space',
      key: ' ',
      bubbles: true,
    });
    Object.defineProperty(event, 'target', { value: button, writable: false });

    handleKeyboardShortcut(event, codeShortcutMap, keyShortcutMap);

    expect(shouldIgnoreTarget).toHaveBeenCalledWith(button);
    expect(action).not.toHaveBeenCalled();
  });

  it('does nothing when no shortcut matches', () => {
    const div = document.createElement('div');
    const action = vi.fn();
    const codeShortcutMap = new Map<string, ShortcutBinding>();
    const keyShortcutMap = new Map<string, ShortcutBinding>();

    const event = new KeyboardEvent('keydown', {
      code: 'KeyX',
      key: 'x',
      bubbles: true,
    });
    Object.defineProperty(event, 'target', { value: div, writable: false });

    handleKeyboardShortcut(event, codeShortcutMap, keyShortcutMap);

    expect(action).not.toHaveBeenCalled();
  });

  it('handles case-insensitive key matching', () => {
    const div = document.createElement('div');
    const action = vi.fn();
    const codeShortcutMap = new Map<string, ShortcutBinding>();
    const keyShortcutMap = new Map<string, ShortcutBinding>([
      ['n', { action, preventDefault: true }],
    ]);

    const event = new KeyboardEvent('keydown', {
      code: 'KeyN',
      key: 'N',
      bubbles: true,
    });
    Object.defineProperty(event, 'target', { value: div, writable: false });

    handleKeyboardShortcut(event, codeShortcutMap, keyShortcutMap);

    expect(action).toHaveBeenCalledOnce();
  });
});
