import { useEffect, useMemo, useState } from 'react';

import { formatTimeFromMs } from 'utils/time.utils';
import { POLLING_INTERVAL_1MS } from 'config/app';
import { useTimers } from 'providers/TimersProvider/TimerContext';
import { styles } from './RecallTimer.styles';

export const RecallTimer = () => {
  const { recall } = useTimers();
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
