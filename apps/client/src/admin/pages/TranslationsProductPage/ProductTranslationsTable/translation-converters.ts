/**
 * Converts legacy field format (name_es_es) to RHF format (esEs) for the form
 */
export function convertLegacyToRHFFormat(item: any): any {
  return {
    id: item.id,
    name: item.name || '',
    esEs: item.name_es_es || '',
    enGb: item.name_en_gb || '',
    caEs: item.name_ca_es || '',
    // Preserve other fields that might exist (drinkTypeId, etc.)
    ...Object.keys(item).reduce(
      (acc, key) => {
        if (!key.startsWith('name_') && !['id', 'name'].includes(key)) {
          acc[key] = item[key];
        }
        return acc;
      },
      {} as Record<string, any>,
    ),
  };
}

/**
 * Converts RHF format (esEs) back to legacy field format (name_es_es) for the parent hook
 */
export function convertRHFToLegacyFormat(item: any): any {
  return {
    id: item.id,
    name: item.name || '',
    name_es_es: item.esEs || '',
    name_en_gb: item.enGb || '',
    name_ca_es: item.caEs || '',
    // Preserve other fields that might exist (drinkTypeId, etc.)
    ...Object.keys(item).reduce(
      (acc, key) => {
        if (!['id', 'name', 'esEs', 'enGb', 'caEs'].includes(key)) {
          acc[key] = item[key];
        }
        return acc;
      },
      {} as Record<string, any>,
    ),
  };
}
