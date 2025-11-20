import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import SessionView from './SessionView';
import type { ImageItem } from '@/types/core';
import { TranslationProvider } from '@/i18n/TranslationProvider';
import type { ReactNode } from 'react';

const mockImage: ImageItem = {
  id: 'test-image-1',
  url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  name: 'Test Image',
  file: new File(['mock'], 'test-image.png', { type: 'image/png' }),
  status: 'ok',
};

const defaultProps = {
  currentImage: mockImage,
  currentPosition: 1,
  totalImages: 5,
  remainingCount: 4,
  progressPercentage: 50,
  remainingSeconds: 30,
  isPaused: false,
  isMuted: false,
  onPrev: vi.fn(),
  onNext: vi.fn(),
  onPause: vi.fn(),
  onResume: vi.fn(),
  onToggleMute: vi.fn(),
  onEndSession: vi.fn(),
  hasMultipleImages: true,
};

const renderWithProviders = (ui: ReactNode) =>
  render(<TranslationProvider>{ui}</TranslationProvider>);

describe('SessionView keyboard shortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window focus state
    Object.defineProperty(document, 'hasFocus', {
      value: vi.fn(() => true),
      writable: true,
    });
  });

  it('renders session view with image', () => {
    renderWithProviders(<SessionView {...defaultProps} />);

    expect(screen.getByAltText('Test Image')).toBeInTheDocument();
    expect(screen.getByText('Test Image')).toBeInTheDocument();
  });

  it('calls onNext when N key is pressed', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SessionView {...defaultProps} />);

    const sessionView = screen.getByLabelText('Session view');
    sessionView.focus();

    await user.keyboard('n');

    expect(defaultProps.onNext).toHaveBeenCalledOnce();
  });

  it('calls onPrev when P key is pressed', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SessionView {...defaultProps} />);

    const sessionView = screen.getByLabelText('Session view');
    sessionView.focus();

    await user.keyboard('p');

    expect(defaultProps.onPrev).toHaveBeenCalledOnce();
  });

  it('calls onPause when Space is pressed and session is not paused', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SessionView {...defaultProps} isPaused={false} />);

    const sessionView = screen.getByLabelText('Session view');
    sessionView.focus();

    await user.keyboard(' ');

    expect(defaultProps.onPause).toHaveBeenCalledOnce();
    expect(defaultProps.onResume).not.toHaveBeenCalled();
  });

  it('calls onResume when Space is pressed and session is paused', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SessionView {...defaultProps} isPaused={true} />);

    const sessionView = screen.getByLabelText('Session view');
    sessionView.focus();

    await user.keyboard(' ');

    expect(defaultProps.onResume).toHaveBeenCalledOnce();
    expect(defaultProps.onPause).not.toHaveBeenCalled();
  });

  it('does not trigger shortcuts when focus is not within session view', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SessionView {...defaultProps} />);

    // Focus outside the session view by clicking on body
    await user.click(document.body);

    await user.keyboard('n');

    expect(defaultProps.onNext).not.toHaveBeenCalled();
  });

  it('does not trigger shortcuts when typing in editable elements', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <div>
        <input data-testid="test-input" />
        <SessionView {...defaultProps} />
      </div>,
    );

    const input = screen.getByTestId('test-input');
    await user.click(input);
    await user.keyboard('n');

    expect(defaultProps.onNext).not.toHaveBeenCalled();
  });

  it('allows Space to work on pause button with data-session-shortcut attribute', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SessionView {...defaultProps} isPaused={false} />);

    const pauseButton = screen.getByLabelText('Pause session');
    pauseButton.focus();

    await user.keyboard(' ');

    expect(defaultProps.onPause).toHaveBeenCalledOnce();
  });

  it('shows keyboard shortcuts hint', () => {
    renderWithProviders(<SessionView {...defaultProps} />);

    // Check that all shortcut hints are present (may appear multiple times)
    expect(screen.getAllByText(/pause\/resume/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/next/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/prev/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/fullscreen/i).length).toBeGreaterThan(0);
  });

  it('updates fullscreen hint text when in fullscreen', async () => {
    const { container } = renderWithProviders(<SessionView {...defaultProps} />);

    // Initially should show "fullscreen" not "exit fullscreen"
    expect(screen.getByText(/fullscreen/i)).toBeInTheDocument();
    expect(screen.queryByText(/exit fullscreen/i)).not.toBeInTheDocument();

    // Simulate fullscreen change
    const sessionView = container.querySelector('[data-session-view]');
    Object.defineProperty(document, 'fullscreenElement', {
      value: sessionView,
      writable: true,
      configurable: true,
    });

    // Trigger fullscreenchange event
    document.dispatchEvent(new Event('fullscreenchange'));

    // Wait for state update
    await waitFor(() => {
      expect(screen.getByText(/exit fullscreen/i)).toBeInTheDocument();
    });
  });

  it('shows "Keyboard shortcuts active" when focus is within view', () => {
    renderWithProviders(<SessionView {...defaultProps} />);

    const sessionView = screen.getByLabelText('Session view');
    sessionView.focus();

    expect(screen.getByText('Keyboard shortcuts active')).toBeInTheDocument();
  });

  it('shows focus state hint text', () => {
    renderWithProviders(<SessionView {...defaultProps} />);

    // Component auto-focuses on mount, so "Keyboard shortcuts active" should be visible
    // The conditional rendering ensures one of the two texts is always shown
    const activeText = screen.queryByText('Keyboard shortcuts active');
    const enableText = screen.queryByText('Click to enable keyboard shortcuts');
    
    // At least one of the focus state texts should be present
    expect(activeText || enableText).toBeTruthy();
  });

  it('handles multiple key presses in sequence', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SessionView {...defaultProps} />);

    const sessionView = screen.getByLabelText('Session view');
    sessionView.focus();

    await user.keyboard('n');
    await user.keyboard('p');
    await user.keyboard('n');

    expect(defaultProps.onNext).toHaveBeenCalledTimes(2);
    expect(defaultProps.onPrev).toHaveBeenCalledOnce();
  });

  it('prevents default behavior for shortcut keys', async () => {
    renderWithProviders(<SessionView {...defaultProps} />);

    const sessionView = screen.getByLabelText('Session view');
    sessionView.focus();

    const spaceEvent = new KeyboardEvent('keydown', {
      code: 'Space',
      key: ' ',
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault');

    sessionView.dispatchEvent(spaceEvent);

    // Note: userEvent.keyboard already handles preventDefault, so we test the event directly
    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});

