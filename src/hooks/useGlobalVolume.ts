import { useCallback, useEffect, useState } from 'react';

import { updatePlayingAudioVolume } from 'utils/soundCache.utils';
import { getStoredVolume, setStoredVolume } from 'utils/volume.utils';

/**
 * Hook for managing global volume setting
 * Provides reactive access to the current volume and methods to update it
 */
export const useGlobalVolume = () => {
  const [volume, setVolume] = useState<number>(() => getStoredVolume());

  // Update volume in state, storage, and any currently playing audio
  const updateVolume = useCallback((newVolume: number) => {
    // Update state immediately for responsive UI
    setVolume(newVolume);

    // Update volume of currently playing audio immediately
    updatePlayingAudioVolume(newVolume);

    // Persist to storage (no debounce to ensure it's always saved)
    setStoredVolume(newVolume);
  }, []);

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sound-volume' && e.newValue !== null) {
        const newVolume = Number.parseInt(e.newValue, 10);
        if (!Number.isNaN(newVolume) && newVolume !== volume) {
          setVolume(newVolume);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [volume]);

  return {
    volume,
    updateVolume,
    // Helper to get volume as decimal (0-1) for audio elements
    audioVolume: volume / 100,
  };
};
