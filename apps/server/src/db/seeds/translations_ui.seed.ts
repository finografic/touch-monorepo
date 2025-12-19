import { db } from '../db.adapter';
import { translations_ui } from '../schemas';

/**
 * Flattened UI translations from packages/i18n/src/translations/common/*.json
 *
 * Structure:
 * - Keys use dot notation (e.g., "buttons.add", "tables.headers.name")
 * - Translations are stored as JSON object keyed by language code
 * - The "ui" parent node is skipped (table name is translations_ui)
 *
 * Generated from:
 * - packages/i18n/src/translations/common/es-ES.json
 * - packages/i18n/src/translations/common/en-GB.json
 * - packages/i18n/src/translations/common/ca-ES.json
 */
const translationsData = [
  {
    key: 'ui.buttons.add',
    translations: {
      'es-ES': 'Añadir123',
      'en-GB': 'Add',
      'ca-ES': 'Afegir',
    },
    description: 'Add button label',
  },
  {
    key: 'ui.buttons.all',
    translations: {
      'es-ES': 'TODOS',
      'en-GB': 'ALL',
      'ca-ES': 'TOTS',
    },
    description: 'All button label',
  },
  {
    key: 'ui.buttons.back',
    translations: {
      'es-ES': 'Atrás',
      'en-GB': 'Back',
      'ca-ES': 'Enrere',
    },
    description: 'Back button label',
  },
  {
    key: 'ui.buttons.cancel',
    translations: {
      'es-ES': 'Cancelar',
      'en-GB': 'Cancel',
      'ca-ES': 'Cancel·lar',
    },
    description: 'Cancel button label',
  },
  {
    key: 'ui.buttons.clear',
    translations: {
      'es-ES': 'Limpiar',
      'en-GB': 'Clear',
      'ca-ES': 'Netejar',
    },
    description: 'Clear button label',
  },
  {
    key: 'ui.buttons.close',
    translations: {
      'es-ES': 'Cerrar',
      'en-GB': 'Close',
      'ca-ES': 'Tancar',
    },
    description: 'Close button label',
  },
  {
    key: 'ui.buttons.delete',
    translations: {
      'es-ES': 'Eliminar',
      'en-GB': 'Delete',
      'ca-ES': 'Eliminar',
    },
    description: 'Delete button label',
  },
  {
    key: 'ui.buttons.edit',
    translations: {
      'es-ES': 'Editar',
      'en-GB': 'Edit',
      'ca-ES': 'Editar',
    },
    description: 'Edit button label',
  },
  {
    key: 'ui.buttons.next',
    translations: {
      'es-ES': 'Siguiente',
      'en-GB': 'Next',
      'ca-ES': 'Següent',
    },
    description: 'Next button label',
  },
  {
    key: 'ui.buttons.ok',
    translations: {
      'es-ES': 'Aceptar',
      'en-GB': 'OK',
      'ca-ES': 'Acceptar',
    },
    description: 'OK button label',
  },
  {
    key: 'ui.buttons.previous',
    translations: {
      'es-ES': 'Anterior',
      'en-GB': 'Previous',
      'ca-ES': 'Anterior',
    },
    description: 'Previous button label',
  },
  {
    key: 'ui.buttons.programProduct',
    translations: {
      'es-ES': 'Programar Producto',
      'en-GB': 'Program Product',
      'ca-ES': 'Programar Producte',
    },
    description: 'Program Product button label',
  },
  {
    key: 'ui.buttons.programTime',
    translations: {
      'es-ES': 'Programar Tiempo',
      'en-GB': 'Program Time',
      'ca-ES': 'Programar Temps',
    },
    description: 'Program Time button label',
  },
  {
    key: 'ui.buttons.remove',
    translations: {
      'es-ES': 'Eliminar',
      'en-GB': 'Remove',
      'ca-ES': 'Eliminar',
    },
    description: 'Remove button label',
  },
  {
    key: 'ui.buttons.repeatSelection',
    translations: {
      'es-ES': 'Repetir Selección',
      'en-GB': 'Repeat Selection',
      'ca-ES': 'Repetir Selecció',
    },
    description: 'Repeat Selection button label',
  },
  {
    key: 'ui.buttons.reset',
    translations: {
      'es-ES': 'Restablecer',
      'en-GB': 'Reset',
      'ca-ES': 'Restablir',
    },
    description: 'Reset button label',
  },
  {
    key: 'ui.buttons.save',
    translations: {
      'es-ES': 'Guardar',
      'en-GB': 'Save',
      'ca-ES': 'Desar',
    },
    description: 'Save button label',
  },
  {
    key: 'ui.buttons.select',
    translations: {
      'es-ES': 'Seleccionar',
      'en-GB': 'Select',
      'ca-ES': 'Seleccionar',
    },
    description: 'Select button label',
  },
  {
    key: 'ui.buttons.start',
    translations: {
      'es-ES': 'INICIAR',
      'en-GB': 'START',
      'ca-ES': 'INICIAR',
    },
    description: 'Start button label',
  },
  {
    key: 'ui.buttons.submit',
    translations: {
      'es-ES': 'Enviar',
      'en-GB': 'Submit',
      'ca-ES': 'Enviar',
    },
    description: 'Submit button label',
  },
  {
    key: 'ui.buttons.update',
    translations: {
      'es-ES': 'Actualizar',
      'en-GB': 'Update',
      'ca-ES': 'Actualitzar',
    },
    description: 'Update button label',
  },
  {
    key: 'ui.buttons.view',
    translations: {
      'es-ES': 'Ver',
      'en-GB': 'View',
      'ca-ES': 'Veure',
    },
    description: 'View button label',
  },
  {
    key: 'ui.tables.headers.displayIndex',
    translations: {
      'es-ES': '#',
      'en-GB': '#',
      'ca-ES': '#',
    },
    description: 'Table header: Display index column',
  },
  {
    key: 'ui.tables.headers.index',
    translations: {
      'es-ES': '#',
      'en-GB': '#',
      'ca-ES': '#',
    },
    description: 'Table header: Index column',
  },
  {
    key: 'ui.tables.headers.mode',
    translations: {
      'es-ES': 'Modo',
      'en-GB': 'Mode',
      'ca-ES': 'Mode',
    },
    description: 'Table header: Mode column',
  },
  {
    key: 'ui.tables.headers.drinkType',
    translations: {
      'es-ES': 'Tipo de Bebida',
      'en-GB': 'Drink Type',
      'ca-ES': 'Tipus de Beguda',
    },
    description: 'Table header: Drink Type column',
  },
  {
    key: 'ui.tables.headers.drinkSubtype',
    translations: {
      'es-ES': 'Subtipo',
      'en-GB': 'Subtype',
      'ca-ES': 'Subtipus',
    },
    description: 'Table header: Drink Subtype column',
  },
  {
    key: 'ui.tables.headers.subtype',
    translations: {
      'es-ES': 'Subtipo',
      'en-GB': 'Subtype',
      'ca-ES': 'Subtipus',
    },
    description: 'Table header: Subtype column',
  },
  {
    key: 'ui.tables.headers.volume',
    translations: {
      'es-ES': 'Volumen',
      'en-GB': 'Volume',
      'ca-ES': 'Volum',
    },
    description: 'Table header: Volume column',
  },
  {
    key: 'ui.tables.headers.containerType',
    translations: {
      'es-ES': 'Envase',
      'en-GB': 'Container',
      'ca-ES': 'Envas',
    },
    description: 'Table header: Container Type column',
  },
  {
    key: 'ui.tables.headers.container',
    translations: {
      'es-ES': 'Envase',
      'en-GB': 'Container',
      'ca-ES': 'Envas',
    },
    description: 'Table header: Container column',
  },
  {
    key: 'ui.tables.headers.temperature',
    translations: {
      'es-ES': 'Temperatura',
      'en-GB': 'Temperature',
      'ca-ES': 'Temperatura',
    },
    description: 'Table header: Temperature column',
  },
  {
    key: 'ui.tables.headers.defaultTempConsume',
    translations: {
      'es-ES': 'Temperatura',
      'en-GB': 'Temperature',
      'ca-ES': 'Temperatura',
    },
    description: 'Table header: Default Temperature Consume column',
  },
  {
    key: 'ui.tables.headers.actions',
    translations: {
      'es-ES': 'Acciones',
      'en-GB': 'Actions',
      'ca-ES': 'Accions',
    },
    description: 'Table header: Actions column',
  },
  {
    key: 'ui.tables.headers.name',
    translations: {
      'es-ES': 'Nombre',
      'en-GB': 'Name',
      'ca-ES': 'Nom',
    },
    description: 'Table header: Name column',
  },
  {
    key: 'ui.tables.headers.dbKey',
    translations: {
      'es-ES': 'clave db',
      'en-GB': 'db key',
      'ca-ES': 'clau db',
    },
    description: 'Table header: Database Key column',
  },
  {
    key: 'ui.time.units.seconds',
    translations: {
      'es-ES': 'segundos',
      'en-GB': 'seconds',
      'ca-ES': 'segons',
    },
    description: 'Time unit: seconds',
  },
  {
    key: 'ui.time.units.minutes',
    translations: {
      'es-ES': 'minutos',
      'en-GB': 'minutes',
      'ca-ES': 'minuts',
    },
    description: 'Time unit: minutes',
  },
  {
    key: 'ui.time.units.hours',
    translations: {
      'es-ES': 'horas',
      'en-GB': 'hours',
      'ca-ES': 'hores',
    },
    description: 'Time unit: hours',
  },
  {
    key: 'ui.time.units.days',
    translations: {
      'es-ES': 'días',
      'en-GB': 'days',
      'ca-ES': 'dies',
    },
    description: 'Time unit: days',
  },
  {
    key: 'ui.time.relative.now',
    translations: {
      'es-ES': 'ahora',
      'en-GB': 'now',
      'ca-ES': 'ara',
    },
    description: 'Relative time: now',
  },
  {
    key: 'ui.time.relative.justNow',
    translations: {
      'es-ES': 'hace un momento',
      'en-GB': 'just now',
      'ca-ES': 'ara mateix',
    },
    description: 'Relative time: just now',
  },
  {
    key: 'ui.time.relative.minutesAgo',
    translations: {
      'es-ES': 'hace {{count}} minutos',
      'en-GB': '{{count}} minutes ago',
      'ca-ES': 'fa {{count}} minuts',
    },
    description: 'Relative time: minutes ago (with count placeholder)',
  },
  {
    key: 'ui.time.relative.hoursAgo',
    translations: {
      'es-ES': 'hace {{count}} horas',
      'en-GB': '{{count}} hours ago',
      'ca-ES': 'fa {{count}} hores',
    },
    description: 'Relative time: hours ago (with count placeholder)',
  },
] as const;

export async function seed() {
  console.log('Seeding translations_ui...');

  try {
    // Check if translations already exist
    const existing = await db.select().from(translations_ui).limit(1);
    if (existing.length > 0) {
      console.log('✓ UI translations already seeded, skipping...');
      return;
    }

    // Insert all translation entries
    const insertedTranslations = await db
      .insert(translations_ui)
      .values(
        translationsData.map((item) => ({
          key: item.key,
          translations: item.translations,
          isActive: true,
        })),
      )
      .returning();

    console.log('✅ UI translations seed completed successfully!');
    console.log(`   Inserted ${insertedTranslations.length} translation entries`);
    return insertedTranslations;
  } catch (error) {
    console.error('❌ Error seeding UI translations:', error);
    throw error;
  }
}
