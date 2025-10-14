// Volume utility functions for sound management
export const VOLUME_STORAGE_KEY = 'sound-volume';
export const DEFAULT_VOLUME = 25; // Reduced from 50 to 25 (50% reduction)

/**
 * Get the current volume level from sessionStorage
 * @returns Volume level (0-100) or default volume if not set
 */
export const getStoredVolume = (): number => {
  const stored = sessionStorage.getItem(VOLUME_STORAGE_KEY);
  return stored ? Number.parseInt(stored, 10) : DEFAULT_VOLUME;
};

/**
 * Set the volume level in sessionStorage
 * @param volume Volume level (0-100)
 */
export const setStoredVolume = (volume: number): void => {
  sessionStorage.setItem(VOLUME_STORAGE_KEY, volume.toString());
};

/**
 * Get the current volume as a decimal (0-1) for HTMLAudioElement
 * @returns Volume level (0-1) for audio elements
 */
export const getAudioVolume = (): number => {
  return getStoredVolume() / 100;
};

/**
 * Apply current stored volume to an HTMLAudioElement
 * @param audioElement The audio element to control
 */
export const applyStoredVolumeToAudio = (audioElement: HTMLAudioElement): void => {
  audioElement.volume = getAudioVolume();
};

/**
 * Apply volume to an HTMLAudioElement
 * @param audioElement The audio element to control
 * @param volume Volume level (0-100)
 */
export const applyVolumeToAudio = (audioElement: HTMLAudioElement, volume: number): void => {
  // Convert 0-100 to 0-1 range for audio volume
  audioElement.volume = volume / 100;
};
