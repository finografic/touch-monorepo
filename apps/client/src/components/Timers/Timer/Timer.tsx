import React from 'react';

import { formatTime } from 'utils/time.utils';

import { useTimerLogic } from './useTimerLogic';

interface TimerProps {
  slotNumber: number;
  onComplete?: () => void;
}

/**
 * Timer Component - Pure UI Component
 *
 * Displays timer countdown for a specific slot.
 * All timer logic is handled by the useTimerLogic hook.
 *
 * Features:
 * - Clean separation of concerns
 * - Pure UI component
 * - Automatic cleanup
 * - Type-safe props
 */
export const Timer: React.FC<TimerProps> = ({ slotNumber, onComplete }) => {
  const { remainingTime, status } = useTimerLogic(slotNumber, onComplete);

  // If no timer or timer is not processing, show empty
  if (status !== 'processing') {
    return <span>00:00</span>;
  }

  return <span>{formatTime(remainingTime)}</span>;
};
