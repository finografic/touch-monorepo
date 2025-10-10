// Time configuration for Programar Tiempo feature
// Values are in seconds for easier calculation

import { formatTime, isValidTime } from 'utils/time.utils';

export const TIME_MIN_SECONDS = 1; // 1 second minimum
export const TIME_MAX_SECONDS = 3599; // (segundos)
export const TIME_DEFAULT_SECONDS = 60; // 1 minute default

// Step increments for time controls
export const TIME_STEP_SECONDS = 1; // 1 second steps
export const TIME_STEP_MINUTES = 60; // 1 minute steps

// Display configuration
export const TIME_DISPLAY = {
  MIN_MINUTES: Math.floor(TIME_MIN_SECONDS / 60),
  MAX_MINUTES: Math.floor(TIME_MAX_SECONDS / 60),
  DEFAULT_MINUTES: Math.floor(TIME_DEFAULT_SECONDS / 60),
  DEFAULT_SECONDS_REMAINDER: TIME_DEFAULT_SECONDS % 60,
} as const;

// Validation helpers
export const isValidTimeInSeconds = (totalSeconds: number): boolean => {
  return isValidTime(totalSeconds, TIME_MIN_SECONDS, TIME_MAX_SECONDS);
};

// Re-export formatTime for backward compatibility
export const formatTimeDisplay = formatTime;
