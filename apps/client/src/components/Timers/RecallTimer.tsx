import { useEffect, useMemo } from 'react';

import { useTimers } from 'providers/TimersProvider/TimersContext';

import { formatTimeDuration } from 'utils/time.utils';
import { useDev } from 'dev-tools/providers/DevProvider';
import { useHeartbeatSubscription } from './shared/useHeartbeatSubscription';
import { styles } from './RecallTimer.styles';

export const RecallTimer = () => {
  const { isDevToolsVisible } = useDev();
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

  if (!isDevToolsVisible) {
    return null;
  }

  return (
    <div css={styles}>
      <div className="config-timer">
        <span>
          Configuration expires in: <strong>{formatTimeDuration({ ms: remainingTime })}</strong>
        </span>
      </div>
    </div>
  );
};
