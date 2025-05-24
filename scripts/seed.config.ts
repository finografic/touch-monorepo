// import type { SeedConfig } from '@finografic/project-scripts/db-setup';
import type { SeedConfig } from './src/db-setup';

export const seedOrder: SeedConfig[] = [
  {
    name: 'drink_types',
    description: 'Base drink types and subtypes',
  },
  {
    name: 'drink_subtypes',
    description: 'Drink subtypes',
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
  {
    name: 'drink_configs',
    description: 'drink configurations',
    dependencies: ['drink_types', 'container_types', 'volumes'],
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
