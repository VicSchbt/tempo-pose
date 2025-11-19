/**
 * Utility function to play the ding sound when timer expires.
 * Uses the Audio API to play the sound file from the public directory.
 */
export function playDingSound(): void {
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

