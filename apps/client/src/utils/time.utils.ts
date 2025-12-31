/**
 * Time Utilities
 *
 * Centralized time formatting and parsing utilities.
 * Consolidates multiple formatTime implementations across the codebase.
 */

/**
 * Formats a duration as an `mm:ss` string.
 *
 * Accepts either seconds directly, or milliseconds via an object.
 * Returns `"00:00"` for null or undefined input.
 *
 * @returns A zero-padded duration string in `mm:ss` format.
 *
 * @example
 * formatTimeDuration(125)            // "02:05"
 * formatTimeDuration({ ms: 125000 }) // "02:05"
 * formatTimeDuration()               // "00:00"
 */
export function formatTimeDuration(seconds?: number | null): string;
export function formatTimeDuration(input?: { ms: number | null }): string;
export function formatTimeDuration(input?: number | null | { ms: number | null }): string {
  const seconds = typeof input === 'number' ? input : input?.ms != null ? Math.floor(input.ms / 1000) : null;

  if (seconds == null) return '00:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Parses an `mm:ss` duration string into seconds.
 *
 * Returns `0` for invalid input.
 *
 * @returns Duration in seconds.
 *
 * @example
 * parseDurationString("02:05") // 125
 * parseDurationString("00:00") // 0
 * parseDurationString("oops")  // 0
 */
export const parseTimeDurationToSeconds = (value: string): number => {
  if (!value || !value.includes(':')) return 0;

  const [mins, secs] = value.split(':').map(Number);
  if (Number.isNaN(mins) || Number.isNaN(secs)) return 0;

  return mins * 60 + secs;
};

/**
 * Checks whether a duration (in seconds) falls within an allowed range.
 *
 * Defaults to the range `0` → `59:59`.
 *
 * @returns True if the duration is within bounds.
 *
 * @example
 * isValidDuration(125)  // true
 * isValidDuration(3600) // false
 * isValidDuration(-1)   // false
 */
export const isValidTimeDuration = (seconds: number, minSeconds = 0, maxSeconds = 3599): boolean => {
  return seconds >= minSeconds && seconds <= maxSeconds;
};
