export type ShortcutBinding = {
  action: () => void;
  preventDefault?: boolean;
  shouldIgnoreTarget?: (target: HTMLElement | null) => boolean;
};

export function isEditableElement(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }

  const tag = element.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || element.isContentEditable;
}

export function isButtonLikeElement(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }

  if (element.tagName === 'BUTTON') {
    return true;
  }

  const role = element.getAttribute('role');
  return role === 'button';
}

export function handleKeyboardShortcut(
  event: KeyboardEvent,
  codeShortcutMap: Map<string, ShortcutBinding>,
  keyShortcutMap: Map<string, ShortcutBinding>,
  isEditableCheck: (element: HTMLElement | null) => boolean = isEditableElement,
): void {
  const target = event.target as HTMLElement | null;

  if (isEditableCheck(target)) {
    return;
  }

  const shortcut = codeShortcutMap.get(event.code) ?? keyShortcutMap.get(event.key.toLowerCase());

  if (!shortcut) {
    return;
  }

  if (shortcut.shouldIgnoreTarget?.(target)) {
    return;
  }

  if (shortcut.preventDefault) {
    event.preventDefault();
  }

  shortcut.action();
}
