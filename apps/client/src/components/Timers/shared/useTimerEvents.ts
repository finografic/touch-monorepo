/**
 * Shared hook for timer event handling
 * - Detects when to fire tick events
 * - Detects when to fire complete/repeat events
 * - Prevents duplicate events with refs
 * - Works for both countdown and snooze timers
 */

import { useRef } from 'react';

import type { CompleteEventParams, TickEventParams } from './timer.types';

export interface UseTimerEventsProps {
  onTick?: (params: TickEventParams) => void;
  onComplete?: (params: CompleteEventParams) => void;
}

export interface UseTimerEventsReturn {
  handleTickEvent: (params: TickEventParams) => void;
  handleCompleteEvent: (params: CompleteEventParams) => void;
  resetEventTracking: () => void;
  lastEventNumber: number;
}

/**
 * Hook to manage timer event firing with deduplication
 *
 * @example
 * ```typescript
 * const { handleTickEvent, resetEventTracking } = useTimerEvents({
 *   onTick: ({ elapsed, remaining, eventNumber }) => {
 *     console.log('TICK', { elapsed, remaining, eventNumber });
 *     playAlarmSound();
 *   },
 *   onComplete: ({ elapsed, remaining }) => {
 *     console.log('COMPLETE', { elapsed, remaining });
 *     playCompleteSound();
 *   },
 * });
 *
 * // In your update loop:
 * const { eventNumber } = getElapsedTimeAndEventNumber(duration, remaining);
 * handleTickEvent(eventNumber, { elapsed, remaining, eventNumber });
 * ```
 */
export const useTimerEvents = ({ onTick, onComplete }: UseTimerEventsProps = {}): UseTimerEventsReturn => {
  const lastEventFiredRef = useRef<number>(-1);

  const handleTickEvent = (params: TickEventParams) => {
    // Only fire if event number has increased (prevents duplicates)
    if (params.eventNumber > lastEventFiredRef.current) {
      lastEventFiredRef.current = params.eventNumber;
      onTick?.(params);
    }
  };

  const handleCompleteEvent = (params: CompleteEventParams) => {
    onComplete?.(params);
  };

  const resetEventTracking = () => {
    lastEventFiredRef.current = -1;
  };

  return {
    handleTickEvent,
    handleCompleteEvent,
    resetEventTracking,
    lastEventNumber: lastEventFiredRef.current,
  };
};
