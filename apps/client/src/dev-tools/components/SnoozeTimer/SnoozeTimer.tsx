import { useEffect, useState } from 'react';

import { formatTimeFromMs } from 'utils/time.utils';

import { POLLING_INTERVAL_MS, SNOOZE_INTERVAL_MS, STORAGE_KEYS } from 'config/app';
import { TimerResetIcon } from 'styles/icons/icons';
import { styles } from './SnoozeTimer.styles';

export const SnoozeTimer = () => {
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    const checkRemainingTime = () => {
      const timestamp = sessionStorage.getItem(STORAGE_KEYS.SNOOZE_TIMESTAMP);
      if (!timestamp) {
        setRemainingTime(0);
        return;
      }

      const startTime = Number.parseInt(timestamp, 10);
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(0, SNOOZE_INTERVAL_MS - elapsed);

      setRemainingTime(remaining);

      if (remaining <= 0) {
        sessionStorage.removeItem(STORAGE_KEYS.SNOOZE_TIMESTAMP);
      }
    };

    checkRemainingTime();

    const intervalId = setInterval(checkRemainingTime, POLLING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  // if (remainingTime <= 0) {
  //   return null;
  // }

  return (
    <div css={styles}>
      <div className="snooze-timer">
        <span>
          <TimerResetIcon />
          <strong>{formatTimeFromMs(remainingTime)}</strong>
        </span>
      </div>
    </div>
  );
};
