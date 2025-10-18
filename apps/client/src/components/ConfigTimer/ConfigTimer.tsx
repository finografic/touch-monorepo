import { useEffect, useState } from 'react';

import { formatTimeFromMs } from 'utils/time.utils';

import { CONFIG_EXPIRY_TIME_MS, STORAGE_KEYS } from 'config/app';
import { styles } from './ConfigTimer.styles';

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
        <span>
          Configuration expires in: <strong>{formatTimeFromMs(remainingTime)}</strong>
        </span>
      </div>
    </div>
  );
};
