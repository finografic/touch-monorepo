import { getCachedSettings, playCachedSound, playSoundFromUrl } from 'utils/soundCache.utils';

/**
 * Timer Sound Utilities
 *
 * Handles all sound-related functionality for timers.
 * Separated from core timer logic for better organization.
 */

/**
 * Play the configured tick sound from API with fallback
 */
export async function playTickSound(): Promise<void> {
  try {
    const settings = await getCachedSettings();
    if (settings.tick) {
      try {
        await playCachedSound(settings.tick, 0.2);
      } catch (cachedError) {
        console.warn('Cached tick sound failed, trying URL fallback:', cachedError);
        await playSoundFromUrl(settings.tick, 0.2);
      }
    }
  } catch (e) {
    console.warn('Could not play tick sound:', e);
    // Fallback: do nothing
  }
}

/**
 * Play the configured complete sound from API with fallback
 */
export async function playCompleteSound(): Promise<void> {
  try {
    const settings = await getCachedSettings();
    if (settings.finish) {
      try {
        await playCachedSound(settings.finish, 0.2);
      } catch (cachedError) {
        console.warn('Cached complete sound failed, trying URL fallback:', cachedError);
        await playSoundFromUrl(settings.finish, 0.2);
      }
    }
  } catch (e) {
    console.warn('Could not play complete sound:', e);
    // Fallback: do nothing
  }
}

/**
 * Default sound handler with silent fallback
 */
export function makeDefaultSound(): void {
  playCompleteSound().catch(() => {
    // Silent fallback
  });
}

/**
 * User sound handler with silent fallback
 */
export function makeUserSound(key: 'tick' | 'complete'): void {
  if (key === 'tick') {
    playTickSound().catch(() => {
      // Silent fallback
    });
  } else if (key === 'complete') {
    playCompleteSound().catch(() => {
      // Silent fallback
    });
  }
}
