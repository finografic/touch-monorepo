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
export { getCycleNumber, getElapsedTimeAndEventNumberMs } from './shared/timer.utils';

// ============================================================================
// Shared Utilities
// ============================================================================

export type {
  TimerManagerState,
  TimerRegistryState,
  TimerSubscriptionRegistryState,
} from './shared/TimerSubscriptionRegistry';
export { timerSubscriptionRegistry } from './shared/TimerSubscriptionRegistry';
export { useTimerEvents } from './shared/useTimerEvents';

// ============================================================================
// Types
// ============================================================================

export type { UseTimerEventsProps } from './shared/useTimerEvents';
export { SnoozeTimer } from './SnoozeTimer'; // TODO: Move to SnoozeTimer/
export { Timer as CountdownTimer } from './Timer'; // TODO: Move to CountdownTimer/
