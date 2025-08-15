declare module '@bugsnag/cuid' {
  /**
   * Generate a new CUID
   */
  export default function createCuid(): string;

  /**
   * Check if a string is a valid CUID
   */
  export function isCuid(str: string): boolean;

  /**
   * Get the timestamp part of a CUID
   */
  export function getTimestamp(str: string): number;

  /**
   * Get the counter part of a CUID
   */
  export function getCounter(str: string): number;

  /**
   * Get the fingerprint part of a CUID
   */
  export function getFingerprint(str: string): string;

  /**
   * Get the random part of a CUID
   */
  export function getRandom(str: string): string;
}
