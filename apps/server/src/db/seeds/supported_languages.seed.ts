import { db } from '../db.adapter';
import { supported_languages } from '../schemas';

export async function seed() {
  console.log('Seeding supported_languages...');

  try {
    // Check if languages already exist
    const existing = await db.select().from(supported_languages).limit(1);
    if (existing.length > 0) {
      console.log('✓ Supported languages already seeded, skipping...');
      return;
    }

    // Insert current supported languages
    const insertedLanguages = await db
      .insert(supported_languages)
      .values([
        {
          isoCode: 'es-ES', // Updated to full locale format
          nativeName: 'Español',
          displayName: 'Spanish (Spain)',
          flagCode: 'ES',
          isActive: true,
          isDefault: true, // Spanish is the default language
          sortOrder: 1,
        },
        {
          isoCode: 'en-GB', // Updated to full locale format
          nativeName: 'English',
          displayName: 'English (United Kingdom)',
          flagCode: 'GB',
          isActive: true,
          isDefault: false,
          sortOrder: 2,
        },
        {
          isoCode: 'ca-ES', // Updated to full locale format
          nativeName: 'Català',
          displayName: 'Catalan (Spain)',
          flagCode: 'CAT', // Custom flag code for Catalonia (maps to ES in flag utils)
          isActive: true,
          isDefault: false,
          sortOrder: 3,
        },
      ])
      .returning();

    console.log('✅ Supported languages seed completed successfully!');
    console.log(`   Inserted ${insertedLanguages.length} languages`);
    return insertedLanguages;
  } catch (error) {
    console.error('❌ Error seeding supported languages:', error);
    throw error;
  }
}
