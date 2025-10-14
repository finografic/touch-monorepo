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
 * await playTickSound(); // Play with global volume setting
 */
export async function playTickSound(): Promise<void> {
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

/**
 * Play a custom sound from URL with fallback
 * Uses global volume setting from sessionStorage
 *
 * @param soundUrl - URL of the sound to play
 * @returns Promise that resolves when sound playback completes
 *
 * @example
 * await playCustomSound('https://example.com/sound.mp3');
 */
export async function playCustomSound(soundUrl: string): Promise<void> {
  try {
    try {
      await playCachedSound(soundUrl);
    } catch (cachedError) {
      console.warn('Cached custom sound failed, trying URL fallback:', cachedError);
      await playSoundFromUrl(soundUrl);
    }
  } catch (e) {
    console.warn('Could not play custom sound:', e);
    // Fallback: do nothing
  }
}

/**
 * Default sound handler with silent fallback
 * Plays the complete sound with global volume setting
 *
 * @example
 * makeDefaultSound(); // Plays complete sound, ignores errors
 */
export function makeDefaultSound(): void {
  playCompleteSound().catch(() => {
    // Silent fallback
  });
}

/**
 * User sound handler with silent fallback
 * Plays specified sound type with global volume setting
 *
 * @param key - Sound type to play
 *
 * @example
 * makeUserSound('alarm'); // Plays alarm sound
 * makeUserSound('complete'); // Plays complete sound
 */
export function makeUserSound(key: 'alarm' | 'complete'): void {
  if (key === 'alarm') {
    playTickSound().catch(() => {
      // Silent fallback
    });
  } else if (key === 'complete') {
    playCompleteSound().catch(() => {
      // Silent fallback
    });
  }
}

/**
 * Sound configuration interface
 * Used for type safety when working with sound settings
 */
export interface SoundConfig {
  alarm?: string;
  finish?: string;
  volume?: number;
}

/**
 * Play sound based on configuration
 * Uses global volume setting from sessionStorage
 *
 * @param config - Sound configuration object
 * @param soundType - Type of sound to play
 *
 * @example
 * const config = { alarm: 'alarm.mp3', finish: 'complete.mp3' };
 * await playSoundFromConfig(config, 'alarm'); // Plays alarm sound with global volume
 * await playSoundFromConfig(config, 'complete'); // Plays complete sound with global volume
 */
export async function playSoundFromConfig(
  config: SoundConfig,
  soundType: 'alarm' | 'complete',
): Promise<void> {
  const soundUrl = soundType === 'alarm' ? config.alarm : config.finish;

  if (soundUrl) {
    await playCustomSound(soundUrl);
  }
}
