// import type { SeedConfig } from '@finografic/project-scripts/db-setup';
import type { SeedConfig } from './src/db-setup';

export const seedOrder: SeedConfig[] = [
  {
    name: 'orders',
    description: 'Example orders',
    // dependencies: ['drink_types', 'drink_subtypes', 'volumes', 'container_types'],
  },
  {
    name: 'drink_types',
    description: 'Base drink types and subtypes',
  },
  {
    name: 'container_types',
    description: 'Container types (plastic, glass, metal)',
  },
  {
    name: 'volumes',
    description: 'Available volumes (33cl, 50cl, etc)',
  },
  {
    name: 'temperature_tables',
    description: 'Temperature-time cooling tables',
  },
  {
    name: 'drink_configs',
    description: 'drink configurations',
    dependencies: ['drink_types', 'container_types', 'volumes', 'temperature_tables'],
  },
  {
    name: 'elements',
    description: 'Cooling elements',
  },
  {
    name: 'running_orders',
    description: 'Example running orders',
    dependencies: ['elements', 'drink_configs'],
  },
];
