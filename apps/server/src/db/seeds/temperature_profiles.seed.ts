import { db } from '../db.adapter';
import { cooling_profiles, temperature_profiles } from '../schemas';

// Define the type for our temperature profile rows
type TemperatureProfileRow = typeof temperature_profiles.$inferInsert;

export async function seed() {
  console.log('Seeding temperature_profiles...');

  try {
    // Clean existing data first
    console.log('Cleaning existing temperature profiles...');
    await db.delete(temperature_profiles);
    console.log('✓ Cleaned existing temperature profiles');

    // Get a cooling profile
    const [coolingProfile] = await db.select().from(cooling_profiles).limit(1);
    if (!coolingProfile) {
      throw new Error('No cooling profile found. Please seed cooling_profiles first.');
    }

    // Generate temperatures from 30.0 to -10.0 in 0.5 degree increments
    const temperatures: number[] = [];
    for (let temp = 30.0; temp >= -10.0; temp -= 0.5) {
      temperatures.push(Number(temp.toFixed(1))); // Ensure we have exactly one decimal place
    }

    const rows: TemperatureProfileRow[] = [];
    temperatures.forEach((temp, i) => {
      // Calculate base time value (increases by 3 for each temperature point)
      const baseTime = i * 3;

      // Format temperature for ID with sign and one decimal
      const tempStr = (temp >= 0 ? '+' : '') + temp.toFixed(1);

      // Add a single profile point for each temperature with different multipliers per type
      // Type A: base rate (fastest)
      // Type B: 25% longer than Type A
      // Type C: 60% longer than Type A (slowest)
      rows.push({
        id: `temp_${tempStr}`,
        coolingProfileId: coolingProfile.id,
        temperature: temp,
        timeA: Math.round(baseTime * 1.0), // Type A: base rate
        timeB: Math.round(baseTime * 1.25), // Type B: 25% longer
        timeC: Math.round(baseTime * 1.6), // Type C: 60% longer
      });
    });

    await db.insert(temperature_profiles).values(rows);
    console.log('✅ Inserted temperature profiles!');
    return rows;
  } catch (error) {
    console.error('❌ Error seeding temperature profiles:', error);
    throw error;
  }
}
