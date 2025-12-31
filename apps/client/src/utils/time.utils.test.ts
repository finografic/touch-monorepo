import { describe, expect, it } from 'vitest';

import { formatTimeDuration, isValidTimeDuration, parseTimeDurationToSeconds } from './time.utils';

describe('time.utils', () => {
  describe('formatTimeDuration', () => {
    it('formats seconds to mm:ss', () => {
      expect(formatTimeDuration(125)).toBe('02:05');
      expect(formatTimeDuration(0)).toBe('00:00');
      expect(formatTimeDuration(3599)).toBe('59:59');
    });

    it('formats milliseconds to mm:ss', () => {
      expect(formatTimeDuration({ ms: 125000 })).toBe('02:05');
      expect(formatTimeDuration({ ms: 1500 })).toBe('00:01'); // Floors to seconds
    });

    it('handles null/undefined', () => {
      expect(formatTimeDuration(null)).toBe('00:00');
      expect(formatTimeDuration({ ms: null })).toBe('00:00');
    });
  });

  describe('parseTimeDurationToSeconds', () => {
    it('parses mm:ss to seconds', () => {
      expect(parseTimeDurationToSeconds('02:05')).toBe(125);
      expect(parseTimeDurationToSeconds('00:00')).toBe(0);
      expect(parseTimeDurationToSeconds('1:30')).toBe(90); // Single-digit minutes
    });

    it('returns 0 for invalid input', () => {
      expect(parseTimeDurationToSeconds('invalid')).toBe(0);
      expect(parseTimeDurationToSeconds('12')).toBe(0); // No colon
    });

    it('round-trips with formatTimeDuration', () => {
      const formatted = formatTimeDuration(125);
      expect(parseTimeDurationToSeconds(formatted)).toBe(125);
    });
  });

  describe('isValidTimeDuration', () => {
    it('validates with default range (0-3599)', () => {
      expect(isValidTimeDuration(125)).toBe(true);
      expect(isValidTimeDuration(3599)).toBe(true);
      expect(isValidTimeDuration(-1)).toBe(false);
      expect(isValidTimeDuration(3600)).toBe(false);
    });

    it('validates with custom range', () => {
      expect(isValidTimeDuration(50, 30, 100)).toBe(true);
      expect(isValidTimeDuration(29, 30, 100)).toBe(false);
      expect(isValidTimeDuration(101, 30, 100)).toBe(false);
    });
  });
});
