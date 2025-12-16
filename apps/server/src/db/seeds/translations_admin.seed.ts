import { db } from '../db.adapter';
import { translations_admin } from '../schemas';

/**
 * Flattened Admin translations from packages/i18n/src/translations/app/*.json
 *
 * Structure:
 * - Keys use dot notation (e.g., "admin.title", "admin.pages.dashboard.title")
 * - Translations are stored as JSON object keyed by language code
 *
 * Generated from:
 * - packages/i18n/src/translations/app/es-ES.json
 * - packages/i18n/src/translations/app/en-GB.json
 * - packages/i18n/src/translations/app/ca-ES.json
 */
const translationsData = [
  {
    key: 'admin.description',
    translations: {
      'es-ES': 'Gestionar configuraciones del sistema, traducciones y configuraciones',
      'en-GB': 'Manage system settings, translations, and configurations',
      'ca-ES': 'Gestionar configuracions del sistema, traduccions i configuracions',
    },
  },
  {
    key: 'admin.filterAnalysis.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Analitzar dades de comandes i comportament de filtrat',
    },
  },
  {
    key: 'admin.filterAnalysis.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Anàlisi de Filtres',
    },
  },
  {
    key: 'admin.languages.card_public.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Seleccionar idioma per defecte',
    },
  },
  {
    key: 'admin.languages.card_public.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': "Selecció d'idioma",
    },
  },
  {
    key: 'admin.languages.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Configurar idiomes del sistema i localització',
    },
  },
  {
    key: 'admin.languages.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': "Gestió d'idiomes",
    },
  },
  {
    key: 'admin.maintenance.card_public.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Gestionar manteniment',
    },
  },
  {
    key: 'admin.maintenance.card_public.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Manteniment',
    },
  },
  {
    key: 'admin.maintenance.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Gestionar manteniment general',
    },
  },
  {
    key: 'admin.maintenance.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Manteniment',
    },
  },
  {
    key: 'admin.mode.card_public.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Seleccionar mode per defecte',
    },
  },
  {
    key: 'admin.mode.card_public.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Mode',
    },
  },
  {
    key: 'admin.mode.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Seleccionar mode per defecte',
    },
  },
  {
    key: 'admin.mode.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Mode',
    },
  },
  {
    key: 'admin.orders.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Configurar idiomes del sistema i localització',
    },
  },
  {
    key: 'admin.orders.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Gestió de configuracion',
    },
  },
  {
    key: 'admin.pages.dashboard.description',
    translations: {
      'es-ES': 'Resumen del sistema',
      'en-GB': 'System Overview',
      'ca-ES': 'Resum del sistema',
    },
  },
  {
    key: 'admin.pages.dashboard.title',
    translations: {
      'es-ES': 'Panel de control',
      'en-GB': 'Dashboard',
      'ca-ES': 'Tauler',
    },
  },
  {
    key: 'admin.pages.items.description',
    translations: {
      'es-ES': 'Gestionar registros de la base de datos',
      'en-GB': 'Manage database records',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.items.title',
    translations: {
      'es-ES': 'Gestión de registros',
      'en-GB': 'Records Management',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.languages.card_public.description',
    translations: {
      'es-ES': 'Seleccionar idioma por defecto',
      'en-GB': 'Select your preferred language',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.languages.card_public.title',
    translations: {
      'es-ES': 'Selección de idioma',
      'en-GB': 'Language Selection',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.languages.description',
    translations: {
      'es-ES': 'Configurar idiomas del sistema y localización',
      'en-GB': 'Configure system languages and localization',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.languages.title',
    translations: {
      'es-ES': 'Gestión de idiomas',
      'en-GB': 'Language Management',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.maintenance.card_public.description',
    translations: {
      'es-ES': 'Gestionar mantenimiento',
      'en-GB': 'Manage general maintenance',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.maintenance.card_public.title',
    translations: {
      'es-ES': 'Mantenimiento',
      'en-GB': 'Maintenance',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.maintenance.description',
    translations: {
      'es-ES': 'Manage general maintenance',
      'en-GB': 'Manage general maintenance',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.maintenance.title',
    translations: {
      'es-ES': 'Maintenance',
      'en-GB': 'Maintenance',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.mode.card_public.description',
    translations: {
      'es-ES': 'Seleccionar modo por defecto',
      'en-GB': 'Select default mode',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.mode.card_public.title',
    translations: {
      'es-ES': 'Modo',
      'en-GB': 'Mode Selection',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.mode.description',
    translations: {
      'es-ES': 'Select default mode',
      'en-GB': 'Select default mode',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.mode.title',
    translations: {
      'es-ES': 'Mode',
      'en-GB': 'Mode',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.relays.description',
    translations: {
      'es-ES': 'Manage relays',
      'en-GB': 'Manage relays',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.relays.title',
    translations: {
      'es-ES': 'Relays',
      'en-GB': 'Relays',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.slotConfig.description',
    translations: {
      'es-ES': 'Configure MainPage grid layout and slot types',
      'en-GB': 'Configure MainPage grid layout and slot types',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.slotConfig.title',
    translations: {
      'es-ES': 'Grid',
      'en-GB': 'Grid',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.sounds.description',
    translations: {
      'es-ES': 'Upload and configure sound files for timer events',
      'en-GB': 'Upload and configure sound files for timer events',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.sounds.title',
    translations: {
      'es-ES': 'Sound Management',
      'en-GB': 'Sound Management',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.translations.card.description',
    translations: {
      'es-ES': 'Editar traducciones para contenido de base de datos',
      'en-GB': 'Edit translations for database content',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.translations.card.title',
    translations: {
      'es-ES': 'Idioma de productos',
      'en-GB': 'Translation Management',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.translations.content.containerTypes.description',
    translations: {
      'es-ES': 'Materiales de contenedores (plástico, vidrio, metal)',
      'en-GB': 'Container materials (plastico, vidrio, metal)',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.translations.content.containerTypes.title',
    translations: {
      'es-ES': 'Tipos de contenedores',
      'en-GB': 'Container Types',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.translations.content.drinkSubtypes.description',
    translations: {
      'es-ES': 'Subtipos de vino y cerveza (rubia, negra, tinto, blanco)',
      'en-GB': 'Wine and beer subtypes (rubia, negra, tinto, blanco)',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.translations.content.drinkSubtypes.title',
    translations: {
      'es-ES': 'Subtipos de bebidas',
      'en-GB': 'Drink Subtypes',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.translations.content.drinkTypes.description',
    translations: {
      'es-ES': 'Categorías principales de bebidas (cerveza, vino, cava, licor, etc.)',
      'en-GB': 'Main drink categories (cerveza, vino, cava, licor, etc.)',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.translations.content.drinkTypes.title',
    translations: {
      'es-ES': 'Tipos de bebidas',
      'en-GB': 'Drink Types',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.translations.content.editTables',
    translations: {
      'es-ES': 'Editar traducciones para tablas de base de datos',
      'en-GB': 'Edit translations for database tables',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.translations.content.management',
    translations: {
      'es-ES': 'Idioma de productos',
      'en-GB': 'Translation Management',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.translations.content.volumes.description',
    translations: {
      'es-ES': 'Volúmenes de contenedores (2L, 1.5L, 50cl, 33cl, etc.)',
      'en-GB': 'Container volumes (2L, 1.5L, 50cl, 33cl, etc.)',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.translations.content.volumes.title',
    translations: {
      'es-ES': 'Volúmenes',
      'en-GB': 'Volumes',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.translations.description',
    translations: {
      'es-ES': 'Editar traducciones para contenido de base de datos',
      'en-GB': 'Edit translations for database content',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.translations.title',
    translations: {
      'es-ES': 'Idioma de productos',
      'en-GB': 'Translation Management',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.uiLabels.description',
    translations: {
      'es-ES': 'Edit user interface labels and translations from local files',
      'en-GB': 'Edit user interface labels and translations from local files',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.pages.uiLabels.title',
    translations: {
      'es-ES': 'Idioma de etiquetas',
      'en-GB': 'UI Labels / Translations',
      'ca-ES': '',
    },
  },
  {
    key: 'admin.relays.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Gestionar relés',
    },
  },
  {
    key: 'admin.relays.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Relés',
    },
  },
  {
    key: 'admin.slotConfig.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Configurar la disposició de la graella de la pàgina principal i tipus de ranures',
    },
  },
  {
    key: 'admin.slotConfig.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Graella',
    },
  },
  {
    key: 'admin.sounds.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Pujar i configurar fitxers de so per a esdeveniments de temporitzador',
    },
  },
  {
    key: 'admin.sounds.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Gestió de Sons',
    },
  },
  {
    key: 'admin.title',
    translations: {
      'es-ES': 'Panel de administración',
      'en-GB': 'Administration Panel',
      'ca-ES': "Panel d'administració",
    },
  },
  {
    key: 'admin.translations.card.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Editar traduccions per contingut de base de dades',
    },
  },
  {
    key: 'admin.translations.card.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Gestió de traduccions',
    },
  },
  {
    key: 'admin.translations.content.containerTypes.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Materials de contenidors (plàstic, vidre, metall)',
    },
  },
  {
    key: 'admin.translations.content.containerTypes.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Tipus de contenidors',
    },
  },
  {
    key: 'admin.translations.content.drinkSubtypes.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Subtipus de vi i cervesa (rubia, negra, tinto, blanco)',
    },
  },
  {
    key: 'admin.translations.content.drinkSubtypes.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Subtipus de begudes',
    },
  },
  {
    key: 'admin.translations.content.drinkTypes.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Categories principals de begudes (cervesa, vi, cava, licor, etc.)',
    },
  },
  {
    key: 'admin.translations.content.drinkTypes.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Tipus de begudes',
    },
  },
  {
    key: 'admin.translations.content.editTables',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Editar traduccions per taules de base de dades',
    },
  },
  {
    key: 'admin.translations.content.management',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Gestió de traduccions',
    },
  },
  {
    key: 'admin.translations.content.volumes.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Volums de contenidors (2L, 1.5L, 50cl, 33cl, etc.)',
    },
  },
  {
    key: 'admin.translations.content.volumes.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Volums',
    },
  },
  {
    key: 'admin.translations.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Editar traduccions per contingut de base de dades',
    },
  },
  {
    key: 'admin.translations.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Gestió de traduccions',
    },
  },
  {
    key: 'admin.uiLabels.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': "Editar etiquetes de la interfície d'usuari i traduccions des de fitxers locals",
    },
  },
  {
    key: 'admin.uiLabels.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Etiquetes UI / Traduccions',
    },
  },
] as const;

export async function seed() {
  console.log('Seeding translations_admin...');

  try {
    const existing = await db.select().from(translations_admin).limit(1);
    if (existing.length > 0) {
      console.log('✓ Admin translations already seeded, skipping...');
      return;
    }

    const insertedTranslations = await db
      .insert(translations_admin)
      .values(
        translationsData.map((item) => ({
          key: item.key,
          translations: item.translations,
          isActive: true,
        })),
      )
      .returning();

    console.log('✅ Admin translations seed completed successfully!');
    console.log(`   Inserted ${insertedTranslations.length} translation entries`);
    return insertedTranslations;
  } catch (error) {
    console.error('❌ Error seeding Admin translations:', error);
    throw error;
  }
}
