import * as v from 'valibot';

/**
 * Accepts boolean, integer (0|1), or string ('0'|'1'|'true'|'false').
 * Normalises everything to 0 or 1 for SQLite storage.
 */
export function sqliteBooleanField(defaultValue?: boolean) {
  const base = v.pipe(
    v.union([
      v.boolean(),
      v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(1)),
      v.literal('true'),
      v.literal('false'),
      v.literal('1'),
      v.literal('0'),
    ]),
    v.transform((value): 0 | 1 => {
      if (typeof value === 'boolean') return value ? 1 : 0;
      if (value === 'true' || value === '1') return 1;
      if (value === 'false' || value === '0') return 0;
      return value as 0 | 1;
    }),
  );

  return defaultValue !== undefined
    ? v.optional(base, defaultValue ? 1 : 0)
    : base;
}

/**
 * Pre-process request data to convert boolean fields to integers.
 * Note: with sqliteBooleanField() in schemas this is usually redundant,
 * but kept for handlers that need explicit coercion before DB writes.
 */
export function convertBooleansToIntegers(
  data: Record<string, any>,
  booleanFields: string[],
): Record<string, any> {
  const converted = { ...data };
  booleanFields.forEach((field) => {
    if (field in converted && converted[field] !== undefined && converted[field] !== null) {
      const value = converted[field];
      if (typeof value === 'boolean') {
        converted[field] = value ? 1 : 0;
      } else if (value === 'true' || value === '1') {
        converted[field] = 1;
      } else if (value === 'false' || value === '0') {
        converted[field] = 0;
      }
    }
  });
  return converted;
}
