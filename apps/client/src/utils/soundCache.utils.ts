import { api } from 'api';

import { applyStoredVolumeToAudio } from 'utils/volume.utils';
import type { SoundFile, SoundSettings } from 'types/sounds.types';

// Audio instance manager with multi-channel support to allow overlapping sounds
class AudioManager {
  #channels: Map<number, HTMLAudioElement> = new Map();
  #maxChannels = 5; // Support up to 5 simultaneous sounds
  #currentChannel = 0;
  #debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

  // Get next available channel (round-robin)
  #getNextChannel = (): number => {
    // Find a channel slot that's not currently playing
    for (let i = 0; i < this.#maxChannels; i++) {
      const channel = (this.#currentChannel + i) % this.#maxChannels;
      const audio = this.#channels.get(channel);
      if (!audio || audio.paused || audio.ended) {
        this.#currentChannel = channel;
        return channel;
      }
    }
    // All channels busy, use next in rotation
    this.#currentChannel = (this.#currentChannel + 1) % this.#maxChannels;
    return this.#currentChannel;
  };

  // Stop specific channel
  stopChannel = (channel: number): void => {
    const audio = this.#channels.get(channel);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      this.#channels.delete(channel);
    }
  };

  // Stop all audio and reset state
  stopAll = (): void => {
    this.#channels.forEach((audio, channel) => {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
    });
    this.#channels.clear();
  };

  // Play audio on next available channel with debouncing
  playAudio = async (audio: HTMLAudioElement, fileId: string, debounceMs: number = 300): Promise<void> => {
    // Apply global volume setting to the audio element
    applyStoredVolumeToAudio(audio);
    console.log(`🔊 Applied global volume (${audio.volume * 100}%) to sound: ${fileId}`);

    // Clear any existing debounce timer for this file
    const existingTimer = this.#debounceTimers.get(fileId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set up debounce timer
    const timer = setTimeout(async () => {
      try {
        // Get next available channel
        const channel = this.#getNextChannel();

        // Stop any audio already playing on this channel
        const existingAudio = this.#channels.get(channel);
        if (existingAudio && !existingAudio.paused) {
          existingAudio.pause();
          existingAudio.currentTime = 0;
          existingAudio.src = '';
        }

        // Set up the new audio on this channel
        this.#channels.set(channel, audio);

        // Add event listeners to clean up when audio finishes
        const cleanup = (): void => {
          this.#channels.delete(channel);
        };

        audio.addEventListener('ended', cleanup, { once: true });
        audio.addEventListener('error', cleanup, { once: true });

        // Play the audio
        await audio.play();
        console.log(`Sound played successfully on channel ${channel}: ${fileId}`);
      } catch (error) {
        console.error('Error playing audio on channel:', error);
      } finally {
        // Clean up the timer
        this.#debounceTimers.delete(fileId);
      }
    }, debounceMs);

    // Store the timer for potential cancellation
    this.#debounceTimers.set(fileId, timer);
  };

  // Check if any audio is currently playing
  getPlaying = (): boolean => {
    return (
      this.#channels.size > 0 &&
      Array.from(this.#channels.values()).some((audio) => !audio.paused && !audio.ended)
    );
  };

  // Update volume of all currently playing audio
  updateVolume = (volume: number): void => {
    // Scale down: 100% slider = 20% actual volume
    const VOLUME_SCALE = 0.2;
    const actualVolume = (volume / 100) * VOLUME_SCALE;

    this.#channels.forEach((audio) => {
      if (!audio.paused && !audio.ended) {
        audio.volume = actualVolume;
      }
    });
    console.log(`🔊 Updated all playing audio volume to ${volume}% (actual: ${actualVolume * 100}%)`);
  };

  // Stop all audio and clear all timers (panic button)
  stopAllAudio = (): void => {
    this.stopAll();
    this.#debounceTimers.forEach((timer) => clearTimeout(timer));
    this.#debounceTimers.clear();
  };
}

// Global audio manager instance
const audioManager = new AudioManager();

// Cache for Base64 encoded sounds
const soundCache = new Map<string, string>();

// Cache for sound settings
let cachedSettings: SoundSettings | null = null;

// Cache for sound files list
let cachedSoundFiles: SoundFile[] = [];

/**
 * Get cached sound files list
 */
export const getCachedSoundFiles = async (): Promise<SoundFile[]> => {
  if (cachedSoundFiles.length > 0) {
    return cachedSoundFiles;
  }

  try {
    const response = await api.get('/sounds');
    cachedSoundFiles = response.data as SoundFile[];
    return cachedSoundFiles;
  } catch (error) {
    console.error('Error fetching sound files:', error);
    return [];
  }
};

/**
 * Update cached sound files
 */
export const updateCachedSoundFiles = (soundFiles: SoundFile[]): void => {
  cachedSoundFiles = [...soundFiles];
};

/**
 * Convert blob to Base64 string with proper data URL format
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      console.log(`FileReader result type: ${typeof result}, length: ${result.length}`);
      console.log(`FileReader result starts with: ${result.substring(0, 50)}`);

      // Ensure we have a proper data URL format
      if (result.startsWith('data:')) {
        resolve(result);
      } else {
        reject(new Error('Invalid data URL format'));
      }
    };
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
};

/**
 * Fetch and cache a sound file as Base64
 */
export const fetchAndCacheSound = async (fileId: string): Promise<string> => {
  // Check if already cached
  if (soundCache.has(fileId)) {
    return soundCache.get(fileId)!;
  }

  try {
    // Get the sound files list to find the actual filename
    const soundFiles = await getCachedSoundFiles();
    const soundFile = soundFiles.find((file) => file.id === fileId);

    if (!soundFile) {
      throw new Error(`Sound file not found: ${fileId}`);
    }

    // Extract filename from URL
    const filename = soundFile.url.split('/').pop();
    if (!filename) {
      throw new Error(`Invalid sound file URL: ${soundFile.url}`);
    }

    // console.log(`Fetching sound: ${fileId} -> ${filename}`);

    // Fetch the sound file as a blob with proper headers - use full server URL
    const response = await fetch(`http://localhost:4040/api/sounds/files/${filename}`, {
      method: 'GET',
      headers: {
        'Accept': 'audio/*',
        'Cache-Control': 'no-cache',
      },
      credentials: 'include', // Include cookies for CORS
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sound: ${response.status} ${response.statusText}`);
    }

    // Check content type
    const contentType = response.headers.get('content-type');
    // console.log(`Response content-type: ${contentType}`);

    if (!contentType || !contentType.startsWith('audio/')) {
      throw new Error(`Invalid content type: ${contentType}. Expected audio/*`);
    }

    const blob = await response.blob();
    // console.log(`Blob received: ${blob.size} bytes, type: ${blob.type}`);

    // Verify blob type
    if (!blob.type.startsWith('audio/')) {
      throw new Error(`Invalid blob type: ${blob.type}. Expected audio/*`);
    }

    // Convert blob to Base64
    const base64 = await blobToBase64(blob);
    // console.log(`Base64 conversion successful, length: ${base64.length}`);

    // Cache the result
    soundCache.set(fileId, base64);

    // console.log(`Cached sound: ${fileId} (${filename})`);
    return base64;
  } catch (error) {
    console.error(`Error caching sound ${fileId}:`, error);
    throw error;
  }
};

/**
 * Play a cached sound by file ID
 * Volume is automatically applied from global settings
 */
export const playCachedSound = async (fileId: string): Promise<void> => {
  try {
    // Get or fetch the cached sound
    const base64 = await fetchAndCacheSound(fileId);
    // Create audio object
    const audio = new Audio(base64);
    // Volume will be applied automatically by audioManager.playAudio

    // console.log('Audio object created, attempting to play...');
    await audioManager.playAudio(audio, fileId);
  } catch (error) {
    console.error(`Error playing cached sound ${fileId}:`, error);
    throw error;
  }
};

/**
 * Alternative: Play sound directly from URL (fallback)
 * Volume is automatically applied from global settings
 */
export const playSoundFromUrl = async (fileId: string): Promise<void> => {
  try {
    // console.log(`Attempting to play sound from URL: ${fileId}`);

    // Get the sound files list to find the actual filename
    const soundFiles = await getCachedSoundFiles();
    const soundFile = soundFiles.find((file) => file.id === fileId);

    if (!soundFile) {
      throw new Error(`Sound file not found: ${fileId}`);
    }

    // Extract filename from URL
    const filename = soundFile.url.split('/').pop();
    if (!filename) {
      throw new Error(`Invalid sound file URL: ${soundFile.url}`);
    }

    const url = `/api/sounds/files/${filename}`;
    // console.log(`Playing from URL: ${url}`);

    // Create and play audio directly from URL
    const audio = new Audio(url);
    // Volume will be applied automatically by audioManager.playAudio

    await audioManager.playAudio(audio, fileId);
    // console.log(`Sound played successfully from URL: ${fileId}`);
  } catch (error) {
    console.error(`Error playing sound from URL ${fileId}:`, error);
    throw error;
  }
};

/**
 * Play sound directly using file path from DTO
 * Volume is automatically applied from global settings
 */
export const playSoundByPath = async (filePath: string): Promise<void> => {
  try {
    console.log(`Playing sound by path: ${filePath}`);

    const url = `http://localhost:4040/api/sounds/files/${filePath}`;
    console.log(`Full URL: ${url}`);

    // First verify the file exists and is audio
    const response = await fetch(url, {
      method: 'HEAD',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`File not found: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    console.log(`File content-type: ${contentType}`);

    if (!contentType || !contentType.startsWith('audio/')) {
      throw new Error(`Invalid content type: ${contentType}. Expected audio/*`);
    }

    const audio = new Audio(url);
    // Volume will be applied automatically by audioManager.playAudio

    // Add event listeners for debugging
    audio.addEventListener('loadstart', () => console.log('Audio: loadstart'));
    audio.addEventListener('durationchange', () => console.log('Audio: durationchange'));
    audio.addEventListener('loadedmetadata', () => console.log('Audio: loadedmetadata'));
    audio.addEventListener('loadeddata', () => console.log('Audio: loadeddata'));
    audio.addEventListener('canplay', () => console.log('Audio: canplay'));
    audio.addEventListener('canplaythrough', () => console.log('Audio: canplaythrough'));
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      console.error('Audio error details:', {
        error: audio.error,
        networkState: audio.networkState,
        readyState: audio.readyState,
        src: audio.src,
        contentType,
      });
    });

    await audioManager.playAudio(audio, filePath);
    console.log(`Sound played successfully by path: ${filePath}`);
  } catch (error) {
    console.error(`Error playing sound by path ${filePath}:`, error);
    throw error;
  }
};

/**
 * Get cached settings
 */
export const getCachedSettings = async (): Promise<SoundSettings> => {
  if (cachedSettings) {
    return cachedSettings;
  }

  try {
    const response = await api.get('/sounds/settings');
    cachedSettings = response.data as SoundSettings;
    return cachedSettings;
  } catch (error) {
    console.error('Error fetching sound settings:', error);
    return { alarm: null, finish: null };
  }
};

/**
 * Update cached settings
 */
export const updateCachedSettings = (settings: SoundSettings): void => {
  cachedSettings = { ...settings };
};

/**
 * Clear the sound cache
 */
export const clearSoundCache = (): void => {
  soundCache.clear();
  cachedSettings = null;
  cachedSoundFiles = [];
};

/**
 * Preload sounds for better performance
 */
export const preloadSounds = async (soundFiles: SoundFile[]): Promise<void> => {
  const promises = soundFiles.map((file) =>
    fetchAndCacheSound(file.id).catch(() => {
      // Silently fail for individual files
      console.warn(`Failed to preload sound: ${file.id}`);
    }),
  );

  await Promise.all(promises);
  console.log(`Preloaded ${soundFiles.length} sounds`);
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  return {
    cachedSounds: soundCache.size,
    hasSettings: cachedSettings !== null,
  };
};

/**
 * Simple test function to verify audio playback works
 * Uses global volume setting
 */
export const testAudioPlayback = async (): Promise<void> => {
  try {
    console.log('Testing basic audio playback...');

    // Test with a simple audio URL - use full server URL
    const testUrl = 'http://localhost:4040/api/sounds/files/sound-alarm-86759-1752858422059-gtrx.mp3';
    console.log(`Testing URL: ${testUrl}`);

    const audio = new Audio(testUrl);
    // Volume will be applied automatically by audioManager.playAudio

    // Add event listeners for debugging
    audio.addEventListener('loadstart', () => console.log('Audio: loadstart'));
    audio.addEventListener('durationchange', () => console.log('Audio: durationchange'));
    audio.addEventListener('loadedmetadata', () => console.log('Audio: loadedmetadata'));
    audio.addEventListener('loadeddata', () => console.log('Audio: loadeddata'));
    audio.addEventListener('canplay', () => console.log('Audio: canplay'));
    audio.addEventListener('canplaythrough', () => console.log('Audio: canplaythrough'));
    audio.addEventListener('error', (e) => console.error('Audio error:', e));

    await audioManager.playAudio(audio, 'test-audio');
    console.log('Basic audio test successful!');
  } catch (error) {
    console.error('Basic audio test failed:', error);
    throw error;
  }
};

/**
 * Update volume of currently playing audio in real-time
 * @param volume Volume level (0-100)
 */
export const updatePlayingAudioVolume = (volume: number): void => {
  audioManager.updateVolume(volume);
};

/**
 * Panic button - stop all audio playback immediately
 */
export const stopAllAudio = (): void => {
  try {
    console.log('🛑 PANIC: Stopping all audio playback');

    // Use the audio manager to stop all audio
    audioManager.stopAllAudio();

    // Also try to stop any Web Audio API contexts
    if (window.AudioContext || (window as any).webkitAudioContext) {
      // This is a more aggressive approach - creates and immediately closes audio contexts
      // which can help stop any ongoing audio processing
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContext.close();
      } catch (e) {
        // Ignore errors if context is already closed
      }
    }

    console.log('✅ All audio stopped');
  } catch (error) {
    console.error('Error stopping audio:', error);
  }
};
