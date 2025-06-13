// Time configuration for Programar Tiempo feature
// Values are in seconds for easier calculation

export const TIME_MIN_SECONDS = 1; // 1 second minimum
export const TIME_MAX_SECONDS = 300; // 5 minutes maximum (5 * 60)
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
  return totalSeconds >= TIME_MIN_SECONDS && totalSeconds <= TIME_MAX_SECONDS;
};

export const formatTimeDisplay = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
