import { useCallback, useEffect, useState } from 'react';
import { getStoredVolume, setStoredVolume } from 'utils/volume.utils';

/**
 * Hook for managing global volume setting
 * Provides reactive access to the current volume and methods to update it
 */
export const useGlobalVolume = () => {
  const [volume, setVolume] = useState<number>(() => getStoredVolume());

  // Update volume in both state and storage
  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
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
