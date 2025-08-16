import { useEffect, useRef, useState } from 'react';
import { useTimers } from 'providers/TimersProvider';
import type { TimerItem } from 'providers/TimersProvider';
import { finishAction, getElapsedAndEventNumber, tickAction } from './timers.utils';

interface TimerV2Props {
  slotNumber: number; // Use slotNumber to find the timer
  onComplete?: () => void;
}

// Initialize the global timer registry if it doesn't exist
if (typeof window !== 'undefined') {
  window.__timerIntervals = window.__timerIntervals || {};
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export const TimerV2 = ({ slotNumber, onComplete }: TimerV2Props) => {
  const { timers, updateTimer } = useTimers();
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const lastEventFiredRef = useRef<number>(-1);

  // Find the timer for this slot
  const timer = timers.find((t) => t.slotNumber === slotNumber);

  // Function to handle timer completion
  const handleTimerComplete = () => {
    console.debug('TimerV2: completing', { slotNumber });

    // First clear the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }

    // Then remove from global registry
    if (typeof window !== 'undefined' && window.__timerIntervals) {
      delete window.__timerIntervals[slotNumber];
    }

    // Finally update the timer status in TimersContext
    if (timer) {
      updateTimer(timer.id, {
        status: 'completed',
        remaining: 0,
        completedAt: new Date().toISOString(),
      });
    }
    onComplete?.();
  };

  useEffect(() => {
    // console.debug('TimerV2: useEffect triggered', {
    //   slotNumber,
    //   timerId: timer?.id,
    //   timerStatus: timer?.status,
    // });
    if (!timer || timer.status !== 'processing') {
      // console.debug('TimerV2: no active timer, skipping', { slotNumber });
      setRemainingTime(0);
      return;
    }

    const endTime = new Date(timer.estimatedCompletionTime!).getTime();
    const startTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000);

    // console.debug('TimerV2: starting', {
    //   slotNumber,
    //   orderId: timer.orderId,
    //   duration: `${duration}s`,
    //   endTime: new Date(endTime).toISOString(),
    // });

    // Set initial remaining time
    setRemainingTime(Math.max(0, duration));
    lastEventFiredRef.current = -1;

    if (duration <= 0) {
      handleTimerComplete();
      return;
    }

    // Store interval ID in global registry
    const intervalId = setInterval(() => {
      const now = Date.now();
      const remaining = Math.floor((endTime - now) / 1000);

      // Update remaining time state to trigger re-render
      setRemainingTime(Math.max(0, remaining));

      // Update timer in TimersContext
      if (timer) {
        updateTimer(timer.id, { remaining: Math.max(0, remaining) });
      }

      // Calculate elapsed time and event number using utility
      const { elapsed, eventNumber } = getElapsedAndEventNumber(timer.duration, remaining);
      if (eventNumber > lastEventFiredRef.current) {
        lastEventFiredRef.current = eventNumber;
        tickAction({ elapsed, remaining, orderId: timer.orderId, eventNumber });
      }

      if (remaining <= 0) {
        finishAction({ elapsed, remaining, orderId: timer.orderId });
        handleTimerComplete();
      }
    }, 1000);

    // Safely store in global registry
    if (typeof window !== 'undefined') {
      window.__timerIntervals = window.__timerIntervals || {};
      window.__timerIntervals[slotNumber] = intervalId;
    }
    intervalRef.current = intervalId;

    return () => {
      // console.debug('TimerV2: cleanup', { slotNumber });
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      if (typeof window !== 'undefined' && window.__timerIntervals) {
        delete window.__timerIntervals[slotNumber];
      }
    };
  }, [timer, slotNumber, updateTimer, onComplete]);

  // If no timer or timer is not processing, show empty
  if (!timer || timer.status !== 'processing') {
    return <span>00:00</span>;
  }

  return <span>{formatTime(remainingTime)}</span>;
};
