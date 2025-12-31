// Time configuration for Programar Tiempo feature
// Values are in seconds for easier calculation

import { isValidTimeDuration } from 'utils/time.utils';

export const TIME_MIN_SECONDS = 1; // 1 second minimum
export const TIME_MAX_SECONDS = 3599; // (segundos)
export const TIME_DEFAULT_SECONDS = 60; // 1 minute default

export const TIME_STEP_SECONDS = 1; // 1 second steps
export const TIME_STEP_MINUTES = 60; // 1 minute steps

export const TIME_DISPLAY = {
  MIN_MINUTES: Math.floor(TIME_MIN_SECONDS / 60),
  MAX_MINUTES: Math.floor(TIME_MAX_SECONDS / 60),
  DEFAULT_MINUTES: Math.floor(TIME_DEFAULT_SECONDS / 60),
  DEFAULT_SECONDS_REMAINDER: TIME_DEFAULT_SECONDS % 60,
} as const;

export const isValidTimeInSeconds = (totalSeconds: number): boolean => {
  return isValidTimeDuration(totalSeconds, TIME_MIN_SECONDS, TIME_MAX_SECONDS);
};
