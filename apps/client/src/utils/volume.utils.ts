// Volume utility functions for sound management
export const VOLUME_STORAGE_KEY = 'sound-volume';
export const DEFAULT_VOLUME = 60; // Default 60% on slider
export const VOLUME_SCALE = 0.2; // Scale factor: 100% slider = 20% actual audio

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
 * Get the current volume as a decimal for HTMLAudioElement
 * Scaled down: 100% slider = 20% actual volume
 * @returns Volume level (0-0.2) for audio elements
 */
export const getAudioVolume = (): number => {
  return (getStoredVolume() / 100) * VOLUME_SCALE;
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
 * Scaled down: 100% slider = 20% actual volume
 * @param audioElement The audio element to control
 * @param volume Volume level (0-100)
 */
export const applyVolumeToAudio = (audioElement: HTMLAudioElement, volume: number): void => {
  // Convert 0-100 to 0-0.2 range for audio volume
  audioElement.volume = (volume / 100) * VOLUME_SCALE;
};
