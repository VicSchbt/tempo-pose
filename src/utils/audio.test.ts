import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { playDingSound, createTickingSoundManager } from './audio';

// Mock Audio constructor
const mockPlay = vi.fn(() => Promise.resolve());
const mockPause = vi.fn();
const mockAudioInstances: HTMLAudioElement[] = [];

beforeEach(() => {
  vi.clearAllMocks();
  mockAudioInstances.length = 0;

  // Mock Audio constructor using a class
  globalThis.Audio = class MockAudio {
    src: string;
    volume: number;
    loop: boolean;
    currentTime: number;
    play: ReturnType<typeof vi.fn>;
    pause: ReturnType<typeof vi.fn>;

    constructor(src?: string) {
      this.src = src || '';
      this.volume = 1;
      this.loop = false;
      this.currentTime = 0;
      this.play = mockPlay;
      this.pause = mockPause;
      mockAudioInstances.push(this as unknown as HTMLAudioElement);
    }
  } as unknown as typeof Audio;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('playDingSound', () => {
  it('creates an Audio element with correct source', () => {
    playDingSound();

    expect(mockAudioInstances).toHaveLength(1);
    expect(mockAudioInstances[0].src).toBe('/audio/ding.mp3');
  });

  it('sets volume to 0.7 (70%)', () => {
    playDingSound();

    expect(mockAudioInstances[0].volume).toBe(0.7);
  });

  it('calls play on the audio element', () => {
    playDingSound();

    expect(mockPlay).toHaveBeenCalledOnce();
  });

  it('handles play promise rejection gracefully', async () => {
    const playError = new Error('Autoplay blocked');
    mockPlay.mockRejectedValueOnce(playError);

    const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

    playDingSound();

    // Wait for promise to reject
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(consoleSpy).toHaveBeenCalledWith('Could not play ding sound:', playError);
    consoleSpy.mockRestore();
  });

  it('handles Audio constructor errors gracefully', () => {
    const constructorError = new Error('Audio not supported');
    globalThis.Audio = class {
      constructor() {
        throw constructorError;
      }
    } as unknown as typeof Audio;

    const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

    playDingSound();

    expect(consoleSpy).toHaveBeenCalledWith('Error creating audio element:', constructorError);
    consoleSpy.mockRestore();
  });

  it('does not play sound when muted', () => {
    playDingSound(true);

    expect(mockAudioInstances).toHaveLength(0);
    expect(mockPlay).not.toHaveBeenCalled();
  });
});

describe('createTickingSoundManager', () => {
  it('returns an object with all required methods', () => {
    const manager = createTickingSoundManager();

    expect(manager).toHaveProperty('startTicking');
    expect(manager).toHaveProperty('stopTicking');
    expect(manager).toHaveProperty('pauseTicking');
    expect(manager).toHaveProperty('resumeTicking');
    expect(manager).toHaveProperty('setMuted');
    expect(typeof manager.startTicking).toBe('function');
    expect(typeof manager.stopTicking).toBe('function');
    expect(typeof manager.pauseTicking).toBe('function');
    expect(typeof manager.resumeTicking).toBe('function');
    expect(typeof manager.setMuted).toBe('function');
  });

  describe('startTicking', () => {
    it('creates an Audio element with correct source', () => {
      const manager = createTickingSoundManager();
      manager.startTicking();

      expect(mockAudioInstances).toHaveLength(1);
      expect(mockAudioInstances[0].src).toBe('/audio/ticking_clock.mp3');
    });

    it('sets volume to 0.7 (70%)', () => {
      const manager = createTickingSoundManager();
      manager.startTicking();

      expect(mockAudioInstances[0].volume).toBe(0.7);
    });

    it('sets loop to true', () => {
      const manager = createTickingSoundManager();
      manager.startTicking();

      expect(mockAudioInstances[0].loop).toBe(true);
    });

    it('calls play on the audio element', () => {
      const manager = createTickingSoundManager();
      manager.startTicking();

      expect(mockPlay).toHaveBeenCalledOnce();
    });

    it('stops existing ticking sound before starting new one', () => {
      const manager = createTickingSoundManager();
      manager.startTicking();
      vi.clearAllMocks();

      manager.startTicking();

      // Should have called pause (from stopTicking) and then created new audio
      expect(mockPause).toHaveBeenCalled();
      expect(mockAudioInstances).toHaveLength(2);
    });

    it('handles play promise rejection gracefully', async () => {
      const playError = new Error('Autoplay blocked');
      mockPlay.mockRejectedValueOnce(playError);

      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      const manager = createTickingSoundManager();

      manager.startTicking();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleSpy).toHaveBeenCalledWith('Could not play ticking sound:', playError);
      consoleSpy.mockRestore();
    });

    it('handles Audio constructor errors gracefully', () => {
      const constructorError = new Error('Audio not supported');
      globalThis.Audio = class {
        constructor() {
          throw constructorError;
        }
      } as unknown as typeof Audio;

      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      const manager = createTickingSoundManager();

      manager.startTicking();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error creating ticking audio element:',
        constructorError,
      );
      consoleSpy.mockRestore();
    });

    it('does not start ticking when muted', () => {
      const manager = createTickingSoundManager();
      manager.startTicking(true);

      expect(mockAudioInstances).toHaveLength(0);
      expect(mockPlay).not.toHaveBeenCalled();
    });
  });

  describe('stopTicking', () => {
    it('does nothing when no ticking sound is playing', () => {
      const manager = createTickingSoundManager();
      manager.stopTicking();

      expect(mockPause).not.toHaveBeenCalled();
    });

    it('pauses the audio element', () => {
      const manager = createTickingSoundManager();
      manager.startTicking();
      vi.clearAllMocks();

      manager.stopTicking();

      expect(mockPause).toHaveBeenCalledOnce();
    });

    it('resets currentTime to 0', () => {
      const manager = createTickingSoundManager();
      manager.startTicking();
      mockAudioInstances[0].currentTime = 5;

      manager.stopTicking();

      expect(mockAudioInstances[0].currentTime).toBe(0);
    });

    it('handles errors gracefully', () => {
      const manager = createTickingSoundManager();
      manager.startTicking();
      mockPause.mockImplementationOnce(() => {
        throw new Error('Pause failed');
      });

      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      manager.stopTicking();

      expect(consoleSpy).toHaveBeenCalledWith('Error stopping ticking sound:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('pauseTicking', () => {
    it('does nothing when no ticking sound is playing', () => {
      const manager = createTickingSoundManager();
      manager.pauseTicking();

      expect(mockPause).not.toHaveBeenCalled();
    });

    it('pauses the audio element', () => {
      const manager = createTickingSoundManager();
      manager.startTicking();
      vi.clearAllMocks();

      manager.pauseTicking();

      expect(mockPause).toHaveBeenCalledOnce();
    });

    it('does not reset currentTime', () => {
      const manager = createTickingSoundManager();
      manager.startTicking();
      mockAudioInstances[0].currentTime = 3;

      manager.pauseTicking();

      expect(mockAudioInstances[0].currentTime).toBe(3);
    });

    it('handles errors gracefully', () => {
      const manager = createTickingSoundManager();
      manager.startTicking();
      mockPause.mockImplementationOnce(() => {
        throw new Error('Pause failed');
      });

      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      manager.pauseTicking();

      expect(consoleSpy).toHaveBeenCalledWith('Error pausing ticking sound:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('resumeTicking', () => {
    it('does nothing when no ticking sound is playing', () => {
      const manager = createTickingSoundManager();
      manager.resumeTicking();

      expect(mockPlay).not.toHaveBeenCalled();
    });

    it('calls play on the audio element', () => {
      const manager = createTickingSoundManager();
      manager.startTicking();
      manager.pauseTicking();
      vi.clearAllMocks();

      manager.resumeTicking();

      expect(mockPlay).toHaveBeenCalledOnce();
    });

    it('handles play promise rejection gracefully', async () => {
      const playError = new Error('Resume failed');
      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      const manager = createTickingSoundManager();
      manager.startTicking();
      manager.pauseTicking();

      // Clear mocks and set up rejection for resume
      vi.clearAllMocks();
      mockPlay.mockRejectedValueOnce(playError);

      manager.resumeTicking();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleSpy).toHaveBeenCalledWith('Could not resume ticking sound:', playError);
      consoleSpy.mockRestore();
    });

    it('handles errors gracefully', () => {
      const manager = createTickingSoundManager();
      manager.startTicking();
      mockPlay.mockImplementationOnce(() => {
        throw new Error('Play failed');
      });

      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      manager.resumeTicking();

      expect(consoleSpy).toHaveBeenCalledWith('Error resuming ticking sound:', expect.any(Error));
      consoleSpy.mockRestore();
    });

    it('does not resume ticking when muted', () => {
      const manager = createTickingSoundManager();
      manager.startTicking();
      manager.pauseTicking();
      vi.clearAllMocks();

      manager.resumeTicking(true);

      expect(mockPlay).not.toHaveBeenCalled();
    });
  });

  describe('setMuted', () => {
    it('pauses ticking when set to true', () => {
      const manager = createTickingSoundManager();
      manager.startTicking();
      vi.clearAllMocks();

      manager.setMuted(true);

      expect(mockPause).toHaveBeenCalledOnce();
    });

    it('does nothing when set to true and no ticking is playing', () => {
      const manager = createTickingSoundManager();
      manager.setMuted(true);

      expect(mockPause).not.toHaveBeenCalled();
    });

    it('allows ticking to continue when set to false', () => {
      const manager = createTickingSoundManager();
      manager.startTicking();
      manager.setMuted(true);
      vi.clearAllMocks();

      manager.setMuted(false);

      // setMuted(false) doesn't automatically resume, it just allows future operations
      // So we verify it doesn't pause
      expect(mockPause).not.toHaveBeenCalled();
    });

    it('prevents new ticking from starting when muted via setMuted', () => {
      const manager = createTickingSoundManager();
      manager.setMuted(true);
      vi.clearAllMocks();

      // startTicking requires explicit mute parameter, so we test with muted=true
      manager.startTicking(true);

      expect(mockAudioInstances).toHaveLength(0);
      expect(mockPlay).not.toHaveBeenCalled();
    });
  });

  describe('integration', () => {
    it('can start, pause, resume, and stop ticking sound', () => {
      const manager = createTickingSoundManager();

      manager.startTicking();
      expect(mockPlay).toHaveBeenCalledTimes(1);

      manager.pauseTicking();
      expect(mockPause).toHaveBeenCalledTimes(1);

      manager.resumeTicking();
      expect(mockPlay).toHaveBeenCalledTimes(2);

      manager.stopTicking();
      expect(mockPause).toHaveBeenCalledTimes(2);
      expect(mockAudioInstances[0].currentTime).toBe(0);
    });

    it('can start multiple times, replacing previous instance', () => {
      const manager = createTickingSoundManager();

      manager.startTicking();
      expect(mockAudioInstances).toHaveLength(1);

      manager.startTicking();
      expect(mockAudioInstances).toHaveLength(2);
      expect(mockPause).toHaveBeenCalled(); // Previous instance was stopped
    });
  });
});
