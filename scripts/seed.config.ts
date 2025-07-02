// import type { SeedConfig } from '@finografic/project-scripts/db-setup';
import type { SeedConfig } from './src/db-setup';

export const seedOrder: SeedConfig[] = [
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
    name: 'cooling_profiles',
    description: 'Cooling profile definitions (slow, medium, fast)',
  },
  {
    name: 'temperature_profiles',
    description: 'Temperature-time points for cooling profiles',
    dependencies: ['cooling_profiles'],
  },
  {
    name: 'orders',
    description: 'Example orders',
    dependencies: ['drink_types', 'drink_subtypes', 'volumes', 'container_types', 'temperature_profiles'],
  },
  // NOTE: 'views' removed - now handled as separate step via db.views.create
  // {
  //   name: 'views',
  //   description: 'Database views (orders_readable, etc.) - created after all data is seeded',
  //   dependencies: ['orders'], // Ensures all tables have data before creating views
  // },
  // {
  //   name: 'drink_configs',
  //   description: 'drink configurations',
  //   dependencies: ['drink_types', 'container_types', 'volumes'],
  // },
  // {
  //   name: 'elements',
  //   description: 'Cooling elements',
  // },
  // {
  //   name: 'running_orders',
  //   description: 'Example running orders',
  //   dependencies: ['elements', 'drink_configs'],
  // },
];
