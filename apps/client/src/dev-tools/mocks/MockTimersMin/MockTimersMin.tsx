import { useCallback } from 'react';

import { useTimers } from 'providers/TimersProvider';

import { FastForwardIcon } from '@workspace/design-system/icons';

export const MockTimersMin = () => {
  const { timers, updateTimerByOrderId } = useTimers();

  const handleSetMinTimers = useCallback(() => {
    // const PERCENTAGE = 0.05; // 5% of remaining time
    const PERCENTAGE = 0.15; // 15% of remaining time
    const MIN_DURATION = 5; // Minimum 5 seconds fallback

    const processingTimers = timers.filter((timer) => timer.status === 'processing');

    processingTimers.forEach((timer) => {
      const percentageDuration = Math.floor(timer.remaining * PERCENTAGE);
      const newDuration = Math.max(percentageDuration, MIN_DURATION);

      console.debug(
        `Timer ${timer.slotNumber}: ${timer.remaining}s → ${newDuration}s (${Math.round(PERCENTAGE * 100)}% or min ${MIN_DURATION}s)`,
      );

      // Update the timer with new duration and remaining time
      updateTimerByOrderId(timer.orderId, {
        duration: newDuration,
        remaining: newDuration,
        completionTime: new Date(Date.now() + newDuration * 1000).toISOString(),
      });
    });
  }, [timers, updateTimerByOrderId]);

  if (!timers.some((timer) => timer.status === 'processing')) return null;

  return (
    <button className="button" onClick={handleSetMinTimers}>
      <FastForwardIcon />
    </button>
  );
};
