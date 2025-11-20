/**
 * Utility function to play the ding sound when timer expires.
 * Uses the Audio API to play the sound file from the public directory.
 * @param isMuted - If true, the sound will not play
 */
export function playDingSound(isMuted = false): void {
  if (isMuted) {
    return;
  }

  try {
    const audio = new Audio('/audio/ding.mp3');
    audio.volume = 0.7; // Set volume to 70%
    audio.play().catch((error) => {
      // Silently handle autoplay restrictions (browser may block autoplay)
      // User interaction is typically required for the first play
      console.debug('Could not play ding sound:', error);
    });
  } catch (error) {
    console.debug('Error creating audio element:', error);
  }
}

/**
 * Manages the ticking clock sound that plays during the countdown.
 * Returns an object with methods to control the ticking sound.
 */
export function createTickingSoundManager() {
  let tickingAudio: HTMLAudioElement | null = null;
  let isMuted = false;

  const startTicking = (muted = false): void => {
    isMuted = muted;
    if (isMuted) {
      return;
    }
    try {
      // Stop any existing ticking sound first
      stopTicking();

      tickingAudio = new Audio('/audio/ticking_clock.mp3');
      tickingAudio.volume = 0.7; // Set volume to 70%
      tickingAudio.loop = true; // Loop continuously
      tickingAudio.play().catch((error) => {
        console.debug('Could not play ticking sound:', error);
      });
    } catch (error) {
      console.debug('Error creating ticking audio element:', error);
    }
  };

  const stopTicking = (): void => {
    if (tickingAudio) {
      try {
        tickingAudio.pause();
        tickingAudio.currentTime = 0;
        tickingAudio = null;
      } catch (error) {
        console.debug('Error stopping ticking sound:', error);
      }
    }
  };

  const pauseTicking = (): void => {
    if (tickingAudio) {
      try {
        tickingAudio.pause();
      } catch (error) {
        console.debug('Error pausing ticking sound:', error);
      }
    }
  };

  const resumeTicking = (muted = false): void => {
    isMuted = muted;
    if (isMuted || !tickingAudio) {
      return;
    }

    try {
      tickingAudio.play().catch((error) => {
        console.debug('Could not resume ticking sound:', error);
      });
    } catch (error) {
      console.debug('Error resuming ticking sound:', error);
    }
  };

  const setMuted = (muted: boolean): void => {
    isMuted = muted;
    if (isMuted && tickingAudio) {
      tickingAudio.pause();
    }
  };

  return {
    startTicking,
    stopTicking,
    pauseTicking,
    resumeTicking,
    setMuted,
  };
}
