import { db } from '../db.adapter';
import { translations_app } from '../schemas';

/**
 * Flattened App translations from packages/i18n/src/translations/app/*.json
 *
 * Structure:
 * - Keys use dot notation (e.g., "app.title", "app.pages.main.title")
 * - Translations are stored as JSON object keyed by language code
 *
 * Generated from:
 * - packages/i18n/src/translations/app/es-ES.json
 * - packages/i18n/src/translations/app/en-GB.json
 * - packages/i18n/src/translations/app/ca-ES.json
 */
const translationsData = [
  {
    key: 'app.components.orderStatus.cancelled',
    translations: {
      'es-ES': 'Cancelado',
      'en-GB': 'Cancelled',
      'ca-ES': 'Cancel·lat',
    },
  },
  {
    key: 'app.components.orderStatus.completed',
    translations: {
      'es-ES': 'Tipos de contenedores',
      'en-GB': 'Container Types',
      'ca-ES': 'Tipus de contenidors',
    },
  },
  {
    key: 'app.components.orderStatus.cooling',
    translations: {
      'es-ES': 'Enfriando',
      'en-GB': 'Cooling',
      'ca-ES': 'Refredant',
    },
  },
  {
    key: 'app.components.orderStatus.heating',
    translations: {
      'es-ES': 'Calentando',
      'en-GB': 'Heating',
      'ca-ES': 'Escalfant',
    },
  },
  {
    key: 'app.components.orderStatus.pending',
    translations: {
      'es-ES': 'Subtipos de bebidas',
      'en-GB': 'Drink Subtypes',
      'ca-ES': 'Subtipus de begudes',
    },
  },
  {
    key: 'app.components.orderStatus.processing',
    translations: {
      'es-ES': 'Tipos de bebidas',
      'en-GB': 'Drink Types',
      'ca-ES': 'Tipus de begudes',
    },
  },
  {
    key: 'app.components.orderStatus.ready',
    translations: {
      'es-ES': 'Listo',
      'en-GB': 'Ready',
      'ca-ES': 'Llest',
    },
  },
  {
    key: 'app.components.temperatureControl.cooling',
    translations: {
      'es-ES': 'Enfriando',
      'en-GB': 'Cooling',
      'ca-ES': 'Refredant',
    },
  },
  {
    key: 'app.components.temperatureControl.current',
    translations: {
      'es-ES': 'Temperatura actual',
      'en-GB': 'Current Temperature',
      'ca-ES': 'Temperatura actual',
    },
  },
  {
    key: 'app.components.temperatureControl.heating',
    translations: {
      'es-ES': 'Calentando',
      'en-GB': 'Heating',
      'ca-ES': 'Escalfant',
    },
  },
  {
    key: 'app.components.temperatureControl.initial',
    translations: {
      'es-ES': 'Establece el tiempo de preparación especificando minutos y segundos',
      'en-GB': 'Set preparation time by specifying minutes and seconds',
      'ca-ES': 'Estableix el temps de preparació especificant minuts i segons',
    },
  },
  {
    key: 'app.components.temperatureControl.maintaining',
    translations: {
      'es-ES': 'Volúmenes',
      'en-GB': 'Volumes',
      'ca-ES': 'Volums',
    },
  },
  {
    key: 'app.components.temperatureControl.target',
    translations: {
      'es-ES': 'Temperatura objetivo',
      'en-GB': 'Target Temperature',
      'ca-ES': 'Temperatura objectiu',
    },
  },
  {
    key: 'app.description',
    translations: {
      'es-ES': 'Sistema de control de temperatura para bebidas',
      'en-GB': 'Temperature control system for beverages',
      'ca-ES': 'Sistema de control de temperatura per begudes',
    },
  },
  {
    key: 'app.orders.active',
    translations: {
      'es-ES': 'Pedidos activos',
      'en-GB': 'Active Orders',
      'ca-ES': 'Comandes actives',
    },
  },
  {
    key: 'app.orders.completed',
    translations: {
      'es-ES': 'Pedidos completados',
      'en-GB': 'Completed Orders',
      'ca-ES': 'Comandes completades',
    },
  },
  {
    key: 'app.orders.description',
    translations: {
      'es-ES': 'Gestionar pedidos de bebidas',
      'en-GB': 'Manage beverage orders',
      'ca-ES': 'Gestionar comandes de begudes',
    },
  },
  {
    key: 'app.orders.new',
    translations: {
      'es-ES': 'Nuevo pedido',
      'en-GB': 'New Order',
      'ca-ES': 'Nova comanda',
    },
  },
  {
    key: 'app.orders.title',
    translations: {
      'es-ES': 'Pedidos',
      'en-GB': 'Orders',
      'ca-ES': 'Comandes',
    },
  },
  {
    key: 'app.pages.container-type.description',
    translations: {
      'es-ES': '',
      'en-GB': 'Choose your container type',
      'ca-ES': 'Tria el teu tipus de contenidor',
    },
  },
  {
    key: 'app.pages.container-type.title',
    translations: {
      'es-ES': '',
      'en-GB': 'Select Container Type',
      'ca-ES': 'Seleccionar tipus de contenidor',
    },
  },
  {
    key: 'app.pages.containerType.description',
    translations: {
      'es-ES': 'Seleccionar tipo de contenedor',
      'en-GB': '',
      'ca-ES': '',
    },
  },
  {
    key: 'app.pages.containerType.title',
    translations: {
      'es-ES': 'Tipos de contenedores',
      'en-GB': '',
      'ca-ES': '',
    },
  },
  {
    key: 'app.pages.containerTypes.description',
    translations: {
      'es-ES': '',
      'en-GB': 'Select container type',
      'ca-ES': 'Seleccionar tipus de contenidor',
    },
  },
  {
    key: 'app.pages.containerTypes.title',
    translations: {
      'es-ES': '',
      'en-GB': 'Container Types',
      'ca-ES': 'Tipus de contenidors',
    },
  },
  {
    key: 'app.pages.drink-subtype.description',
    translations: {
      'es-ES': '',
      'en-GB': 'Choose your beverage subtype',
      'ca-ES': 'Tria el teu subtipus de beguda',
    },
  },
  {
    key: 'app.pages.drink-subtype.title',
    translations: {
      'es-ES': '',
      'en-GB': 'Select Drink Subtype',
      'ca-ES': 'Seleccionar subtipus de beguda',
    },
  },
  {
    key: 'app.pages.drink-type.description',
    translations: {
      'es-ES': '',
      'en-GB': 'Choose your beverage type',
      'ca-ES': 'Tria el teu tipus de beguda',
    },
  },
  {
    key: 'app.pages.drink-type.title',
    translations: {
      'es-ES': '',
      'en-GB': 'Select Drink Type',
      'ca-ES': 'Seleccionar tipus de beguda',
    },
  },
  {
    key: 'app.pages.drink-volume.description',
    translations: {
      'es-ES': '',
      'en-GB': 'Choose your volume',
      'ca-ES': 'Tria el teu volum',
    },
  },
  {
    key: 'app.pages.drink-volume.title',
    translations: {
      'es-ES': '',
      'en-GB': 'Select Volume',
      'ca-ES': 'Seleccionar volum',
    },
  },
  {
    key: 'app.pages.drinkSubtype.description',
    translations: {
      'es-ES': 'Seleccionar subtipo de bebida',
      'en-GB': '',
      'ca-ES': '',
    },
  },
  {
    key: 'app.pages.drinkSubtype.title',
    translations: {
      'es-ES': 'Subtipos de bebidas',
      'en-GB': '',
      'ca-ES': '',
    },
  },
  {
    key: 'app.pages.drinkSubtypes.description',
    translations: {
      'es-ES': '',
      'en-GB': 'Select drink subtype',
      'ca-ES': 'Seleccionar subtipus de beguda',
    },
  },
  {
    key: 'app.pages.drinkSubtypes.title',
    translations: {
      'es-ES': '',
      'en-GB': 'Drink Subtypes',
      'ca-ES': 'Subtipus de begudes',
    },
  },
  {
    key: 'app.pages.drinkType.description',
    translations: {
      'es-ES': 'Seleccionar tipo de bebida',
      'en-GB': 'Select drink type',
      'ca-ES': '',
    },
  },
  {
    key: 'app.pages.drinkType.title',
    translations: {
      'es-ES': 'Tipos de bebidas',
      'en-GB': 'Drink Types',
      'ca-ES': '',
    },
  },
  {
    key: 'app.pages.drinkTypes.description',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Seleccionar tipus de beguda',
    },
  },
  {
    key: 'app.pages.drinkTypes.title',
    translations: {
      'es-ES': '',
      'en-GB': '',
      'ca-ES': 'Tipus de begudes',
    },
  },
  {
    key: 'app.pages.drinkVolume.description',
    translations: {
      'es-ES': 'Seleccionar volumen',
      'en-GB': '',
      'ca-ES': '',
    },
  },
  {
    key: 'app.pages.drinkVolume.title',
    translations: {
      'es-ES': 'Volúmenes',
      'en-GB': '',
      'ca-ES': '',
    },
  },
  {
    key: 'app.pages.main.description',
    translations: {
      'es-ES': 'Página principal',
      'en-GB': 'Main page',
      'ca-ES': 'Pàgina principal',
    },
  },
  {
    key: 'app.pages.main.title',
    translations: {
      'es-ES': 'Principal',
      'en-GB': 'Main',
      'ca-ES': 'Principal',
    },
  },
  {
    key: 'app.pages.temperature.description',
    translations: {
      'es-ES': 'Configura tus preferencias de temperatura',
      'en-GB': 'Set your temperature preferences',
      'ca-ES': 'Configura les teves preferències de temperatura',
    },
  },
  {
    key: 'app.pages.temperature.title',
    translations: {
      'es-ES': 'Control de temperatura',
      'en-GB': 'Temperature Control',
      'ca-ES': 'Control de temperatura',
    },
  },
  {
    key: 'app.pages.temperatureControl.description',
    translations: {
      'es-ES': '',
      'en-GB': 'Select temperature control',
      'ca-ES': 'Seleccionar control de temperatura',
    },
  },
  {
    key: 'app.pages.temperatureControl.title',
    translations: {
      'es-ES': '',
      'en-GB': 'Temperature Control',
      'ca-ES': 'Control de temperatura',
    },
  },
  {
    key: 'app.pages.volumes.description',
    translations: {
      'es-ES': '',
      'en-GB': 'Select volume',
      'ca-ES': 'Seleccionar volum',
    },
  },
  {
    key: 'app.pages.volumes.title',
    translations: {
      'es-ES': '',
      'en-GB': 'Volumes',
      'ca-ES': 'Volums',
    },
  },
  {
    key: 'app.tagline',
    translations: {
      'es-ES': 'Servicio de temperatura perfecto',
      'en-GB': 'Perfect Temperature Service',
      'ca-ES': 'Servei de temperatura perfecte',
    },
  },
  {
    key: 'app.title',
    translations: {
      'es-ES': 'Servi Fresc',
      'en-GB': 'Servi Fresc',
      'ca-ES': 'Servi Fresc',
    },
  },
] as const;

export async function seed() {
  console.log('Seeding translations_app...');

  try {
    const existing = await db.select().from(translations_app).limit(1);
    if (existing.length > 0) {
      console.log('✓ App translations already seeded, skipping...');
      return;
    }

    const insertedTranslations = await db
      .insert(translations_app)
      .values(
        translationsData.map((item) => ({
          key: item.key,
          translations: item.translations,
          isActive: true,
        })),
      )
      .returning();

    console.log('✅ App translations seed completed successfully!');
    console.log(`   Inserted ${insertedTranslations.length} translation entries`);
    return insertedTranslations;
  } catch (error) {
    console.error('❌ Error seeding App translations:', error);
    throw error;
  }
}
