import { useEffect, useMemo, useState } from 'react';

import { formatTimeFromMs } from 'utils/time.utils';
import { POLLING_INTERVAL_1MS } from 'config/app';
import { useTimers } from 'providers/TimersProvider/TimersContext';
import { styles } from './RecallTimer.styles';

export const RecallTimer = () => {
  const { recall, clearRecallConfig } = useTimers();
  const [now, setNow] = useState(() => Date.now());

  // Calculate remaining time based on recall state
  const remainingTime = useMemo(() => {
    if (!recall.expiresAt) {
      return 0;
    }
    const remaining = recall.expiresAt - now;
    return Math.max(0, remaining);
  }, [recall.expiresAt, now]);

  // Update current time periodically to trigger recalculation
  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, POLLING_INTERVAL_1MS);

    return () => clearInterval(intervalId);
  }, []);

  // Auto-clear when expired
  useEffect(() => {
    if (remainingTime <= 0 && recall.config !== null) {
      clearRecallConfig();
    }
  }, [remainingTime, recall.config, clearRecallConfig]);

  if (remainingTime <= 0 || !recall.config) {
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
