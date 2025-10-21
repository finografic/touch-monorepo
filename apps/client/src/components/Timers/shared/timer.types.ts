/**
 * Shared TypeScript types for all timer components
 */

export interface TimerEventData {
  elapsedMs?: number; // For snooze (milliseconds)
  elapsed?: number; // For countdown (seconds)
  remainingMs?: number; // For snooze (milliseconds)
  remaining?: number; // For countdown (seconds)
  eventNumber: number;
  orderId?: string | number;
  cycleNumber?: number; // For snooze repeat cycles
}

export interface TimerCallback {
  (): void;
}

export type TimerStatus = 'idle' | 'processing' | 'completed';

export interface TickEventParams {
  elapsed?: number;
  elapsedMs?: number;
  remaining?: number;
  remainingMs?: number;
  eventNumber: number;
  orderId?: string | number;
}

export interface CompleteEventParams {
  elapsed?: number;
  elapsedMs?: number;
  remaining?: number;
  remainingMs?: number;
  orderId?: string | number;
  cycleNumber?: number;
}
