/**
 * Timers Component Library
 *
 * Unified exports for all timer-related components and utilities
 */

// ============================================================================
// Components
// ============================================================================

export type {
  CompleteEventParams,
  TickEventParams,
  TimerCallback,
  TimerEventData,
  TimerStatus,
} from './shared/timer.types';
export {
  getCycleNumber,
  getElapsedTimeAndEventNumberMs,
  makeDefaultSound,
  makeUserSound,
  playCompleteSound,
  playTickSound,
  TICK_INTERVAL_MS,
} from './shared/timer.utils';

// ============================================================================
// Shared Utilities
// ============================================================================

export type { TimerManagerState } from './shared/TimerManager';
export { timerManager } from './shared/TimerManager';
export { useTimerEvents } from './shared/useTimerEvents';

// ============================================================================
// Types
// ============================================================================

export type { UseTimerEventsProps } from './shared/useTimerEvents';
export { SnoozeTimer } from './SnoozeTimer'; // TODO: Move to SnoozeTimer/
export { Timer as CountdownTimer } from './Timer'; // TODO: Move to CountdownTimer/
