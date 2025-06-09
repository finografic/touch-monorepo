import { useEffect, useState } from 'react';
import { CONFIG_EXPIRY_TIME_MS, STORAGE_KEYS } from 'constants/app.config';
import { styles } from './ConfigTimer.styles';

const formatTime = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const ConfigTimer = () => {
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    const checkRemainingTime = () => {
      const timestamp = sessionStorage.getItem(STORAGE_KEYS.CONFIG_TIMESTAMP);
      if (!timestamp) {
        setRemainingTime(0);
        return;
      }

      const startTime = Number.parseInt(timestamp, 10);
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(0, CONFIG_EXPIRY_TIME_MS - elapsed);

      setRemainingTime(remaining);

      // Clear expired configuration
      if (remaining <= 0) {
        sessionStorage.removeItem(STORAGE_KEYS.LAST_CONFIG);
        sessionStorage.removeItem(STORAGE_KEYS.CONFIG_TIMESTAMP);
      }
    };

    // Initial check
    checkRemainingTime();

    // Update every 5 seconds
    const intervalId = setInterval(checkRemainingTime, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (remainingTime <= 0) {
    return null;
  }

  return (
    <div css={styles}>
      <div className="config-timer">
        <span>Configuration expires in: {formatTime(remainingTime)}</span>
      </div>
    </div>
  );
};
