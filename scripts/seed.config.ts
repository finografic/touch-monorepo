export interface SeedConfig {
  name: string;
  description?: string;
  dependencies?: string[];
}

export const seedOrder: SeedConfig[] = [
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

// Helper to get all available schemas
export const getAllSchemas = () => seedOrder.map((config) => config.name);

// Helper to validate dependencies
export function validateDependencies(selectedSchemas: string[]) {
  const missing: { schema: string; dependencies: string[] }[] = [];

  selectedSchemas.forEach((schema) => {
    const config = seedOrder.find((c) => c.name === schema);
    if (config?.dependencies) {
      const missingDeps = config.dependencies.filter((dep) => !selectedSchemas.includes(dep));
      if (missingDeps.length > 0) {
        missing.push({ schema, dependencies: missingDeps });
      }
    }
  });

  return missing;
}

// Helper to sort schemas based on dependencies
export function getSortedSchemas(selectedSchemas: string[]): string[] {
  const result: string[] = [];
  const visited = new Set<string>();

  function visit(schema: string) {
    if (visited.has(schema)) return;

    const config = seedOrder.find((c) => c.name === schema);
    if (config?.dependencies) {
      config.dependencies.forEach((dep) => {
        if (selectedSchemas.includes(dep)) {
          visit(dep);
        }
      });
    }

    visited.add(schema);
    result.push(schema);
  }

  selectedSchemas.forEach((schema) => visit(schema));
  return result;
}
