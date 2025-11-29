import { useEffect, useMemo } from 'react';

import { formatTimeFromMs } from 'utils/time.utils';
import { useTimers } from 'providers/TimersProvider/TimersContext';
import { useHeartbeatSubscription } from './shared/useHeartbeatSubscription';
import { styles } from './RecallTimer.styles';

export const RecallTimer = () => {
  const { recall, clearRecallConfig } = useTimers();
  const now = useHeartbeatSubscription(); // Subscribe to global heartbeat

  // Calculate remaining time based on recall state
  const remainingTime = useMemo(() => {
    if (!recall.expiresAt) {
      return 0;
    }
    const remaining = recall.expiresAt - now;
    return Math.max(0, remaining);
  }, [recall.expiresAt, now]);

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
