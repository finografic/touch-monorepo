import type { SQL } from 'drizzle-orm';
import type { CamelCasedPropertiesDeep as CamelCaseKeys } from 'type-fest';

import { slugify } from 'utils/string.utils';

// Simple camelCase implementation to avoid lodash dependency
const camelCase = (str: string): string => {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toLowerCase());
};

// Simple mapKeys implementation to avoid lodash dependency
const mapKeys = <T>(
  obj: Record<string, T>,
  iteratee: (value: T, key: string) => string,
): Record<string, T> => {
  const result: Record<string, T> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[iteratee(value, key)] = value;
  }
  return result;
};

// Simple mapValues implementation to avoid lodash dependency
const mapValues = <T, U>(
  obj: Record<string, T>,
  iteratee: (value: T, key: string) => U,
): Record<string, U> => {
  const result: Record<string, U> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = iteratee(value, key);
  }
  return result;
};

export const toCamelCaseKeys = <T>(obj: T): CamelCaseKeys<T> | CamelCaseKeys<T>[] => {
  if (obj === null || obj === undefined) {
    return obj as CamelCaseKeys<T>;
  }
  if (Array.isArray(obj)) {
    return obj.map(toCamelCaseKeys) as CamelCaseKeys<T>[];
  }
  if (typeof obj === 'object') {
    return mapValues(
      mapKeys(obj, (_: any, key: string) => camelCase(key)),
      toCamelCaseKeys,
    ) as CamelCaseKeys<T>;
  }

  return obj as CamelCaseKeys<T>;
};

export const toUpperCaseFirst = (str = ''): string => str?.charAt(0).toUpperCase() + str?.slice(1) || '';
export const toUpperCaseFirstRGX = (str = ''): string =>
  str.replace(/\b[a-z]/gi, (match) => match.toUpperCase());

/**
 * Returns a new string in title case
 * TODO: should lowercase rest of word ??
 * @param {string} str string to modify
 */

export const toTitleCase = (str: string): string =>
  str
    .split(' ')
    // .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');

/**
 * Convert camelCase to kebab-case for CSS variable names
 */
export const camelCaseToKebab = (str: string): string => {
  // Standard camelCase to kebab-case conversion
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

/**
 * Returns a new string in sentence case with spaces added, from camel source
 * @param {string} str string to modify
 */

export const camelCaseToSentence = (str: string): string => {
  const strWithSpaces = str.replace(/([A-Z])/g, ' $1');
  const strFinal = strWithSpaces.charAt(0).toUpperCase() + strWithSpaces.slice(1);

  return strFinal;
};

export const canonicalizeKey = (input: string): string | SQL<unknown> =>
  slugify(input, {
    lower: true,
    strict: true,
    trim: true,
  });
