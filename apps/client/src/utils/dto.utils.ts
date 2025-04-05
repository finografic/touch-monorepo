import { CamelCasedPropertiesDeep } from 'type-fest';
import { camelCase } from 'lodash';

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
