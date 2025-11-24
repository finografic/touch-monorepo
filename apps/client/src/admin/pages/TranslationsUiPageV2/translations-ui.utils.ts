// Helper function to flatten nested objects with dot notation
export const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
  const flattened: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  }

  return flattened;
};

// Helper function to group flattened keys by their first level (since we already extracted 'ui')
export const groupBySection = (flattenedData: Record<string, any>): Record<string, Record<string, any>> => {
  const sections: Record<string, Record<string, any>> = {};

  for (const [key, value] of Object.entries(flattenedData)) {
    const pathParts = key.split('.');
    if (pathParts.length >= 2) {
      const sectionKey = pathParts[0]; // buttons, forms, navigation, etc.
      const itemKey = pathParts.slice(1).join('.'); // The rest of the path

      if (!sections[sectionKey]) {
        sections[sectionKey] = {};
      }
      sections[sectionKey][itemKey] = value;
    }
  }

  return sections;
};
