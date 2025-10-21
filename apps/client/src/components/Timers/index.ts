/**
 * Timers Component Library
 *
 * Unified exports for all timer-related components and utilities
 */

// ============================================================================
// Components
// ============================================================================

export { Timer as CountdownTimer } from './Timer/Timer'; // TODO: Move to CountdownTimer/
export { SnoozeTimer } from './SnoozeTimer/SnoozeTimer'; // TODO: Move to SnoozeTimer/

// ============================================================================
// Shared Utilities
// ============================================================================

export { timerManager } from './shared/TimerManager';
export { useTimerEvents } from './shared/useTimerEvents';
export {
  getCycleNumber,
  getElapsedTimeAndEventNumberMs,
  getElapsedTimeAndEventNumberSec,
  makeDefaultSound,
  makeUserSound,
  playCompleteSound,
  playTickSound,
  TICK_INTERVAL_MS,
} from './shared/timer.utils';

// ============================================================================
// Types
// ============================================================================

export type {
  CompleteEventParams,
  TickEventParams,
  TimerCallback,
  TimerEventData,
  TimerStatus,
} from './shared/timer.types';

export type { TimerManagerState } from './shared/TimerManager';
export type { UseTimerEventsProps, UseTimerEventsReturn } from './shared/useTimerEvents';
