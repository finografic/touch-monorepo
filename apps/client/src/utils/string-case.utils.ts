import { CamelCasedPropertiesDeep as CamelCaseKeys } from 'type-fest';
import { mapKeys, mapValues } from 'lodash';
import { camelCase } from 'lodash';

export const toCamelCaseKeys = <T>(obj: T): CamelCaseKeys<T> | CamelCaseKeys<T>[] => {
  if (obj === null || obj === undefined) {
    return obj as CamelCaseKeys<T>;
  }
  if (Array.isArray(obj)) {
    return obj.map(toCamelCaseKeys) as CamelCaseKeys<T>[];
  }
  if (typeof obj === 'object') {
    return mapValues(
      mapKeys(obj, (_, key) => camelCase(key)),
      toCamelCaseKeys,
    ) as CamelCaseKeys<T>;
  }

  return obj as CamelCaseKeys<T>;
};
