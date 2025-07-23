import type { CamelCasedPropertiesDeep } from 'type-fest';
// Simple camelCase implementation to avoid lodash dependency
function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toLowerCase());
}

export const toCamelCaseKeys = <T extends object>(input: T): CamelCasedPropertiesDeep<T> => {
  if (input === null || input === undefined) {
    return input as CamelCasedPropertiesDeep<T>;
  }
  if (Array.isArray(input)) {
    return input.map((item) => toCamelCaseKeys(item)) as CamelCasedPropertiesDeep<T>;
  }
  if (typeof input === 'object') {
    return Object.entries(input).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [camelCase(key)]: value && typeof value === 'object' ? toCamelCaseKeys(value) : value,
      }),
      {},
    ) as CamelCasedPropertiesDeep<T>;
  }

  return input as CamelCasedPropertiesDeep<T>;
};
