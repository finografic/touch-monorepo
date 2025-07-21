import type { SeedConfig, ViewConfig } from './src/db-setup';

export const seedConfigs: SeedConfig[] = [
  {
    name: 'supported_languages',
    description: 'Supported languages',
  },
  {
    name: 'translatable_entities',
    description: 'Translatable entities',
    dependencies: ['supported_languages'],
  },
  {
    name: 'drink_types',
    description: 'Base drink types and subtypes',
    dependencies: ['translatable_entities'],
  },
  {
    name: 'drink_subtypes',
    description: 'Drink subtypes',
    dependencies: ['translatable_entities'],
  },
  {
    name: 'container_types',
    description: 'Container types (plastic, glass, metal)',
    dependencies: ['translatable_entities'],
  },
  {
    name: 'volumes',
    description: 'Available volumes (33cl, 50cl, etc)',
    dependencies: ['translatable_entities'],
  },
  {
    name: 'modes',
    description: 'Modes - cooling profile definitions (slow, medium, fast, etc..)',
  },
  {
    name: 'slot_configurations',
    description: 'Slot configurations',
    // dependencies: ['translatable_entities'],
  },
  {
    name: 'orders',
    description: 'Example orders',
    dependencies: ['drink_types', 'drink_subtypes', 'volumes', 'container_types', 'modes'],
  },
  {
    name: 'temperature_profiles',
    description: 'Temperature-time points for cooling profiles',
    dependencies: ['modes', 'orders'],
  },
];

export const viewConfigs: ViewConfig[] = [
  {
    name: 'orders_readable',
    description: 'Database views (orders_readable) - created after all data is seeded',
    // dependencies: ['orders'], // TODO: views dependencies local or based on `seedConfigs` ??
  },
];
