/**
 * Time Utilities
 *
 * Centralized time formatting and parsing utilities.
 * Consolidates multiple formatTime implementations across the codebase.
 */

/**
 * Format time in seconds to mm:ss display format
 *
 * @param seconds - Time in seconds (can be undefined/null for fallback)
 * @returns Formatted time string in mm:ss format
 *
 * @example
 * formatTime(125) // "02:05"
 * formatTime(0) // "00:00"
 * formatTime(undefined) // "00:00"
 */
export const formatTime = (seconds: number | undefined | null): string => {
  if (seconds === undefined || seconds === null) return '00:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format time in milliseconds to mm:ss display format
 *
 * @param ms - Time in milliseconds
 * @returns Formatted time string in mm:ss format
 *
 * @example
 * formatTimeFromMs(125000) // "02:05"
 * formatTimeFromMs(0) // "00:00"
 */
export const formatTimeFromMs = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  return formatTime(seconds);
};

/**
 * Parse mm:ss format string to seconds
 *
 * @param timeString - Time string in mm:ss format
 * @returns Time in seconds, or 0 if invalid
 *
 * @example
 * parseTime("02:05") // 125
 * parseTime("00:00") // 0
 * parseTime("invalid") // 0
 */
export const parseTime = (timeString: string): number => {
  if (!timeString || !timeString.includes(':')) return 0;

  const [mins, secs] = timeString.split(':').map(Number);
  if (Number.isNaN(mins) || Number.isNaN(secs)) return 0;

  return mins * 60 + secs;
};

/**
 * Validate if a time value is within acceptable range
 *
 * @param seconds - Time in seconds
 * @param minSeconds - Minimum allowed seconds (default: 0)
 * @param maxSeconds - Maximum allowed seconds (default: 3599 = 59:59)
 * @returns True if time is valid
 *
 * @example
 * isValidTime(125) // true
 * isValidTime(3600) // false (exceeds 59:59)
 * isValidTime(-1) // false
 */
export const isValidTime = (seconds: number, minSeconds: number = 0, maxSeconds: number = 3599): boolean => {
  return seconds >= minSeconds && seconds <= maxSeconds;
};

/**
 * Convert seconds to minutes and seconds components
 *
 * @param seconds - Time in seconds
 * @returns Object with minutes and seconds components
 *
 * @example
 * getTimeComponents(125) // { minutes: 2, seconds: 5 }
 * getTimeComponents(0) // { minutes: 0, seconds: 0 }
 */
export const getTimeComponents = (seconds: number): { minutes: number; seconds: number } => {
  return {
    minutes: Math.floor(seconds / 60),
    seconds: seconds % 60,
  };
};

/**
 * Convert minutes and seconds to total seconds
 *
 * @param minutes - Minutes component
 * @param seconds - Seconds component
 * @returns Total time in seconds
 *
 * @example
 * toTotalSeconds(2, 5) // 125
 * toTotalSeconds(0, 0) // 0
 */
export const toTotalSeconds = (minutes: number, seconds: number): number => {
  return minutes * 60 + seconds;
};
