import { useEffect, useRef, useState } from 'react';
import { useTimers } from 'providers/TimersProvider';
import { finishAction, getElapsedTimeAndEventNumber, tickAction } from './timers.utils';
import { useLayoutUi } from 'providers/LayoutUiProvider';

interface TimerProps {
  slotNumber: number;
  onComplete?: () => void;
}

if (typeof window !== 'undefined') {
  window.__timerIntervals = window.__timerIntervals || {};
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export const Timer = ({ slotNumber, onComplete }: TimerProps) => {
  const { mainPageSelectedSlots, setMainPageSelectedSlots } = useLayoutUi();
  const { timers, updateTimer } = useTimers();
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const lastEventFiredRef = useRef<number>(-1);

  const timer = timers.find((t) => t.slotNumber === slotNumber);

  const handleTimerComplete = () => {
    console.debug('Timer: completing', { slotNumber });

    // First clear the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }

    // Then remove from global registry
    if (typeof window !== 'undefined' && window.__timerIntervals) {
      delete window.__timerIntervals[slotNumber];
    }

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
    if (!timer || timer.status !== 'processing') {
      setRemainingTime(0);
      return;
    }

    const endTime = new Date(timer.estimatedCompletionTime!).getTime();
    const startTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000);

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

      setRemainingTime(Math.max(0, remaining));

      if (timer) {
        updateTimer(timer.id, { remaining: Math.max(0, remaining) });
      }

      const { elapsed, eventNumber } = getElapsedTimeAndEventNumber(timer.duration, remaining);
      if (eventNumber > lastEventFiredRef.current) {
        lastEventFiredRef.current = eventNumber;
        tickAction({ elapsed, remaining, orderId: timer.orderId, eventNumber });
      }

      if (remaining <= 0) {
        const isTimerSelected = mainPageSelectedSlots.find((slot) => slot.slotNumber === slotNumber);
        if (isTimerSelected) {
          const updatedSlots = mainPageSelectedSlots.filter((slot) => slot.slotNumber !== slotNumber);
          log('TIMER_COMPLETE:', 'cyan', timer);
          setMainPageSelectedSlots(updatedSlots);
        }

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
