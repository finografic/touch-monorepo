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
          isoCode: 'es',
          nativeName: 'Español',
          displayName: 'Spanish',
          flagCode: 'ES',
          isActive: true,
          isDefault: true, // Spanish is the default language
          sortOrder: 1,
        },
        {
          isoCode: 'en',
          nativeName: 'English',
          displayName: 'English',
          flagCode: 'GB', // Using GB for United Kingdom
          isActive: true,
          isDefault: false,
          sortOrder: 2,
        },
        {
          isoCode: 'ca', // Fixed: Use standard ISO 639-1 code
          nativeName: 'Català',
          displayName: 'Catalan',
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
