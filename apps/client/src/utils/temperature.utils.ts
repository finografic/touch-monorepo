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
