import type { TemperatureProfile } from 'types/temperature.types';

/**
 * 🚨 TEMPERATURE PROFILE GENERATOR
 *
 * Generates consistent temperature profiles using the same logic as the server seeder.
 * This ensures client-side mock data matches server-side data generation.
 *
 * Based on: apps/server/src/db/seeds/temperature_profiles.seed.ts
 */

// ======================================================================== //
// CONFIGURABLE CONSTANTS (matching server seeder)
// ======================================================================== //

const TEMPERATURE_RANGE = [25, 15, 8, 2];
const TIME_FACTORS = [1.0, 1.5, 2];
const MIN_TIME = 30;
const MAX_TIME = 240;
const TIME_INCREMENT = 30; // Seconds to add between temperature points

// ======================================================================== //
// HELPER FUNCTIONS
// ======================================================================== //

/**
 * Generate a unique ID for temperature profiles
 */
function generateProfileId(prefix: string, index: number): string {
  return `${prefix}-temp-${index}`;
}

/**
 * Calculate drink type index based on drink type name
 * This determines the base time for temperature profiles
 */
function getDrinkTypeIndex(drinkType: string): number {
  const drinkTypeMap: Record<string, number> = {
    cerveza: 0,
    vino: 1,
    cava: 2,
    licor: 3,
    zumo: 4,
    refresco: 5,
    agua: 6,
  };

  return drinkTypeMap[drinkType.toLowerCase()] || 0;
}

/**
 * Generate temperature profiles for a specific mode and drink type
 * Uses the same logic as the server seeder
 */
export function generateTemperatureProfiles(modeId: string, drinkType: string): TemperatureProfile[] {
  const profiles: TemperatureProfile[] = [];

  // Calculate base time for this drink type
  const drinkTypeIndex = getDrinkTypeIndex(drinkType);
  const baseTimeForDrinkType = MIN_TIME + drinkTypeIndex * TIME_INCREMENT;

  console.log(`🚨 TEMP PROFILE: Generating profiles for ${drinkType} (index: ${drinkTypeIndex})`);
  console.log(`🚨 TEMP PROFILE: Base time: ${baseTimeForDrinkType}s`);

  // Process temperatures in DESC order (25°C → 15°C → 8°C → 2°C)
  // Times increase in ASC order (MIN_TIME → MAX_TIME)
  TEMPERATURE_RANGE.forEach((temp, tempIndex) => {
    // Calculate time progression: base time increases for each temperature point
    const timeA = Math.min(MAX_TIME, baseTimeForDrinkType + tempIndex * TIME_INCREMENT);
    const timeB = Math.round(timeA * TIME_FACTORS[1]); // 1.5x
    const timeC = Math.round(timeA * TIME_FACTORS[2]); // 2x

    console.log(`🚨 TEMP PROFILE: ${temp}°C → timeA=${timeA}s, timeB=${timeB}s, timeC=${timeC}s`);

    profiles.push({
      id: generateProfileId('smart', profiles.length + 1),
      modeId,
      temperature: temp,
      timeA,
      timeB,
      timeC,
    });
  });

  console.log(`🚨 TEMP PROFILE: Generated ${profiles.length} profiles for ${drinkType}`);
  return profiles;
}

/**
 * Get the closest temperature profile to a target temperature
 * Used when no exact temperature match exists
 */
export function getClosestTemperatureProfile(
  profiles: TemperatureProfile[],
  targetTemperature: number,
): TemperatureProfile | null {
  if (profiles.length === 0) return null;

  // Find the profile with the smallest temperature difference
  let closestProfile = profiles[0];
  let smallestDiff = Math.abs(profiles[0].temperature - targetTemperature);

  for (const profile of profiles) {
    const diff = Math.abs(profile.temperature - targetTemperature);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestProfile = profile;
    }
  }

  console.log(`🚨 TEMP PROFILE: Closest to ${targetTemperature}°C is ${closestProfile.temperature}°C`);
  return closestProfile;
}

/**
 * Get temperature profiles for a specific temperature range
 * Returns profiles within the specified range
 */
export function getTemperatureProfilesInRange(
  profiles: TemperatureProfile[],
  minTemp: number,
  maxTemp: number,
): TemperatureProfile[] {
  return profiles.filter((profile) => profile.temperature >= minTemp && profile.temperature <= maxTemp);
}
