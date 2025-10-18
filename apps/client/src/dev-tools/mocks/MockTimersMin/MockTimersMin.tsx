import { useCallback } from 'react';

import { useTimers } from 'providers/TimersProvider';

import { TimerIcon } from 'styles/icons';

export const MockTimersMin = () => {
  const { timers, updateTimerByOrderId } = useTimers();

  const handleSetMinTimers = useCallback(() => {
    // Configuration for timer reduction
    const PERCENTAGE = 0.05; // 5% of remaining time
    const MIN_DURATION = 5; // Minimum 5 seconds fallback

    // Find processing timers and update them
    const processingTimers = timers.filter((timer) => timer.status === 'processing');

    processingTimers.forEach((timer) => {
      // Calculate percentage of remaining time
      const percentageDuration = Math.floor(timer.remaining * PERCENTAGE);

      // Use the larger of percentage or minimum duration
      const newDuration = Math.max(percentageDuration, MIN_DURATION);

      console.debug(
        `Timer ${timer.slotNumber}: ${timer.remaining}s → ${newDuration}s (${Math.round(PERCENTAGE * 100)}% or min ${MIN_DURATION}s)`,
      );

      // Update the timer with new duration and remaining time
      updateTimerByOrderId(timer.orderId, {
        duration: newDuration,
        remaining: newDuration,
        estimatedCompletionTime: new Date(Date.now() + newDuration * 1000).toISOString(),
      });
    });
  }, [timers, updateTimerByOrderId]);

  // Only show when there are processing timers
  if (!timers.some((timer) => timer.status === 'processing')) return null;

  return (
    <button className="button" onClick={handleSetMinTimers}>
      <TimerIcon />
    </button>
  );
};
