import type { TemperatureProfile } from 'types/temperature.types';

/**
 * Finds the temperature profile row closest to the target temperature
 */
export const findClosestTemperature = (
  profiles: TemperatureProfile[],
  target: number,
): TemperatureProfile => {
  return profiles.sort((a, b) => Math.abs(a.temperature - target) - Math.abs(b.temperature - target))[0];
};

/**
 * Gets the appropriate time value based on element number
 */
export const getTimeValue = (profile: TemperatureProfile, elementNumber: number): number => {
  if (elementNumber === 1) return profile.timeA;
  if (elementNumber >= 2 && elementNumber <= 9) return profile.timeB;
  if (elementNumber === 10) return profile.timeC;
  return 0;
};

/**
 * Finds the temperature profile row closest to the target initial and final temperature.
 * Allows for optional maxDistance and custom curve/penalty function.
 */
export function findClosestProfile(
  profiles: TemperatureProfile[],
  userInitial: number,
  userFinal: number,
  options?: {
    maxDistance?: number;
    curveFn?: (profile: TemperatureProfile, userInitial: number, userFinal: number) => number;
  },
): TemperatureProfile | null {
  if (!profiles.length) return null;

  let best: { profile: TemperatureProfile; score: number } | null = null;

  for (const profile of profiles) {
    let score: number;
    if (options?.curveFn) {
      score = options.curveFn(profile, userInitial, userFinal);
    } else {
      // Default: sum of differences (can be adjusted)
      score = Math.abs(profile.temperature - userInitial) + Math.abs(profile.temperature - userFinal);
    }
    if (!best || score < best.score) {
      best = { profile, score };
    }
  }

  if (options?.maxDistance !== undefined && best && best.score > options.maxDistance) {
    return null;
  }

  return best?.profile ?? null;
}
