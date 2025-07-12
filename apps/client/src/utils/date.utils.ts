/**
 * Converts a Unix timestamp (seconds) to a JavaScript Date object
 * @param timestamp - Unix timestamp in seconds
 * @returns Date object or null if invalid timestamp
 */
export const parseUnixTimestamp = (timestamp: number | null | undefined): Date | null => {
  if (!timestamp || timestamp <= 0) return null;

  // Convert Unix timestamp (seconds) to milliseconds for JavaScript Date
  return new Date(Number(timestamp) * 1000);
};

/**
 * Formats a Unix timestamp or Date object as a localized date string
 * @param timestamp - Unix timestamp in seconds or Date object
 * @param locale - Optional locale for formatting (defaults to user's locale)
 * @returns Formatted date string or '-' if invalid timestamp
 */
export const formatUnixTimestamp = (timestamp: number | Date | null | undefined, locale?: string): string => {
  if (!timestamp) return '-';

  let date: Date;

  if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    const parsedDate = parseUnixTimestamp(timestamp);
    if (!parsedDate) return '-';
    date = parsedDate;
  }

  return date.toLocaleDateString(locale);
};

/**
 * Formats a Unix timestamp or Date object as a localized date and time string
 * @param timestamp - Unix timestamp in seconds or Date object
 * @param locale - Optional locale for formatting (defaults to user's locale)
 * @returns Formatted date and time string or '-' if invalid timestamp
 */
export const formatUnixTimestampWithTime = (
  timestamp: number | Date | null | undefined,
  locale?: string,
): string => {
  if (!timestamp) return '-';

  let date: Date;

  if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    const parsedDate = parseUnixTimestamp(timestamp);
    if (!parsedDate) return '-';
    date = parsedDate;
  }

  return date.toLocaleString(locale);
};
