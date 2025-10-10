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
 * Play the configured tick sound from API with fallback
 *
 * @param volume - Volume level (0.0 to 1.0, default: 0.2)
 * @returns Promise that resolves when sound playback completes
 *
 * @example
 * await playTickSound(); // Play with default volume
 * await playTickSound(0.5); // Play with 50% volume
 */
export async function playTickSound(volume: number = 0.2): Promise<void> {
  try {
    const settings = await getCachedSettings();
    if (settings.tick) {
      try {
        await playCachedSound(settings.tick, volume);
      } catch (cachedError) {
        console.warn('Cached tick sound failed, trying URL fallback:', cachedError);
        await playSoundFromUrl(settings.tick, volume);
      }
    }
  } catch (e) {
    console.warn('Could not play tick sound:', e);
    // Fallback: do nothing
  }
}

/**
 * Play the configured complete sound from API with fallback
 *
 * @param volume - Volume level (0.0 to 1.0, default: 0.2)
 * @returns Promise that resolves when sound playback completes
 *
 * @example
 * await playCompleteSound(); // Play with default volume
 * await playCompleteSound(0.8); // Play with 80% volume
 */
export async function playCompleteSound(volume: number = 0.2): Promise<void> {
  try {
    const settings = await getCachedSettings();
    if (settings.finish) {
      try {
        await playCachedSound(settings.finish, volume);
      } catch (cachedError) {
        console.warn('Cached complete sound failed, trying URL fallback:', cachedError);
        await playSoundFromUrl(settings.finish, volume);
      }
    }
  } catch (e) {
    console.warn('Could not play complete sound:', e);
    // Fallback: do nothing
  }
}

/**
 * Play a custom sound from URL with fallback
 *
 * @param soundUrl - URL of the sound to play
 * @param volume - Volume level (0.0 to 1.0, default: 0.2)
 * @returns Promise that resolves when sound playback completes
 *
 * @example
 * await playCustomSound('https://example.com/sound.mp3');
 * await playCustomSound('https://example.com/sound.mp3', 0.5);
 */
export async function playCustomSound(soundUrl: string, volume: number = 0.2): Promise<void> {
  try {
    try {
      await playCachedSound(soundUrl, volume);
    } catch (cachedError) {
      console.warn('Cached custom sound failed, trying URL fallback:', cachedError);
      await playSoundFromUrl(soundUrl, volume);
    }
  } catch (e) {
    console.warn('Could not play custom sound:', e);
    // Fallback: do nothing
  }
}

/**
 * Default sound handler with silent fallback
 * Plays the complete sound with default volume
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
 * Plays specified sound type with default volume
 *
 * @param key - Sound type to play
 * @param volume - Volume level (0.0 to 1.0, default: 0.2)
 *
 * @example
 * makeUserSound('tick'); // Plays tick sound
 * makeUserSound('complete', 0.5); // Plays complete sound at 50% volume
 */
export function makeUserSound(key: 'tick' | 'complete', volume: number = 0.2): void {
  if (key === 'tick') {
    playTickSound(volume).catch(() => {
      // Silent fallback
    });
  } else if (key === 'complete') {
    playCompleteSound(volume).catch(() => {
      // Silent fallback
    });
  }
}

/**
 * Sound configuration interface
 * Used for type safety when working with sound settings
 */
export interface SoundConfig {
  tick?: string;
  finish?: string;
  volume?: number;
}

/**
 * Play sound based on configuration
 *
 * @param config - Sound configuration object
 * @param soundType - Type of sound to play
 * @param volume - Volume level (0.0 to 1.0, overrides config volume)
 *
 * @example
 * const config = { tick: 'tick.mp3', finish: 'complete.mp3', volume: 0.3 };
 * await playSoundFromConfig(config, 'tick'); // Plays tick sound at 30% volume
 * await playSoundFromConfig(config, 'complete', 0.8); // Plays complete sound at 80% volume
 */
export async function playSoundFromConfig(
  config: SoundConfig,
  soundType: 'tick' | 'complete',
  volume?: number,
): Promise<void> {
  const finalVolume = volume ?? config.volume ?? 0.2;
  const soundUrl = soundType === 'tick' ? config.tick : config.finish;

  if (soundUrl) {
    await playCustomSound(soundUrl, finalVolume);
  }
}
