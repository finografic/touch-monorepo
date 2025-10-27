import { getCachedSettings, playCachedSound, playSoundFromUrl } from './soundCache.utils';

/**
 * Sound Utilities
 *
 * Centralized sound functionality for the application.
 * Handles sound playback with fallback mechanisms and error handling.
 *
 * Features:
 * - Tick and complete sound playback
 * - Automatic fallback from cached to URL sounds
 * - Silent error handling
 * - Configurable volume levels
 */

/**
 * Play the configured alarm sound from API with fallback
 * Uses global volume setting from sessionStorage
 *
 * @returns Promise that resolves when sound playback completes
 *
 * @example
 * await playAlarmSound(); // Play with global volume setting
 */
export async function playAlarmSound(): Promise<void> {
  try {
    const settings = await getCachedSettings();
    if (settings.alarm) {
      try {
        await playCachedSound(settings.alarm);
      } catch (cachedError) {
        console.warn('Cached alarm sound failed, trying URL fallback:', cachedError);
        await playSoundFromUrl(settings.alarm);
      }
    }
  } catch (e) {
    console.warn('Could not play alarm sound:', e);
    // Fallback: do nothing
  }
}

/**
 * Play the configured complete sound from API with fallback
 * Uses global volume setting from sessionStorage
 *
 * @returns Promise that resolves when sound playback completes
 *
 * @example
 * await playCompleteSound(); // Play with global volume setting
 */
export async function playCompleteSound(): Promise<void> {
  try {
    const settings = await getCachedSettings();
    if (settings.finish) {
      try {
        await playCachedSound(settings.finish);
      } catch (cachedError) {
        console.warn('Cached complete sound failed, trying URL fallback:', cachedError);
        await playSoundFromUrl(settings.finish);
      }
    }
  } catch (e) {
    console.warn('Could not play complete sound:', e);
    // Fallback: do nothing
  }
}
