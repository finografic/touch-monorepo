/**
 * Checks that an object property exists and satisfies a predicate.
 *
 * This is a building block for composable type guards.
 *
 * @example
 * propIs(obj, 'id', (v): v is string => typeof v === 'string')
 */
export function propIs<TKey extends PropertyKey, TValue>(
  obj: Record<string, unknown>,
  key: TKey,
  guard: (value: unknown) => value is TValue,
): obj is Record<TKey, TValue> {
  return Object.hasOwn(obj, key) && guard(obj[key as keyof typeof obj]);
}
