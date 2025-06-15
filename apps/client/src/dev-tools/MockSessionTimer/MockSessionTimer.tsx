import { useCallback } from 'react';
import { CountdownTimerIcon } from '@radix-ui/react-icons';
import { STORAGE_KEYS } from 'constants/app.config';
import { styles } from './MockSessionTimer.styles';

export const MockSessionTimer = () => {
  const handleSetSessionTimer = useCallback(() => {
    const MOCK_DURATION_MS = 10 * 1000; // 10 seconds

    // Set timestamp to make it appear like the config was created (now - expiry_time + 10_seconds) ago
    // This will make the timer show 10 seconds remaining
    const mockStartTime = Date.now() - (3_600_000 - MOCK_DURATION_MS); // 1 hour - 10 seconds

    // Set a dummy config if none exists
    if (!sessionStorage.getItem(STORAGE_KEYS.LAST_CONFIG)) {
      sessionStorage.setItem(
        STORAGE_KEYS.LAST_CONFIG,
        JSON.stringify({
          filters: {},
          temperatures: { default: 25 },
          durations: { default: 300 },
          selectedOrders: [],
        }),
      );
    }

    // Set the timestamp to create a 10-second countdown
    sessionStorage.setItem(STORAGE_KEYS.CONFIG_TIMESTAMP, mockStartTime.toString());

    console.debug('Session timer set to 10 seconds remaining');
  }, []);

  return (
    <button className="btn-dev" css={styles} onClick={handleSetSessionTimer} title="Set Session Timer to 10s">
      <CountdownTimerIcon />
    </button>
  );
};
