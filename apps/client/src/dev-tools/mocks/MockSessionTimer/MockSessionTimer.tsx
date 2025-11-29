import { useCallback } from 'react';

import { useTimers } from 'providers/TimersProvider';
import { TimersContext } from 'providers/TimersProvider/TimersContext';
import { CountdownTimerIcon } from 'styles/icons';

export const MockSessionTimer = () => {
  const { recall } = useTimers();
  const store = TimersContext.useContext();

  const handleSetSessionTimer = useCallback(() => {
    if (!store) {
      console.error('TimersContext store not available');
      return;
    }

    // If there's no existing config, nothing to mock
    if (!recall.config) {
      console.warn('No recall config found to mock');
      return;
    }

    const MOCK_DURATION_MS = 10 * 1000; // 10 seconds
    const now = Date.now();

    // Only update expiresAt to be 10 seconds from now
    store.setState((state) => ({
      ...state,
      recall: {
        ...state.recall,
        expiresAt: now + MOCK_DURATION_MS,
      },
    }));

    console.debug('Recall timer set to 10 seconds remaining');
  }, [recall.config, store]);

  return (
    <button className="button" onClick={handleSetSessionTimer} title="Set Recall Timer to 10s">
      <CountdownTimerIcon />
    </button>
  );
};
