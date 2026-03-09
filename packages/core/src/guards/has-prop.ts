/**
 * Checks that an object contains a given property key.
 *
 * Uses `Object.hasOwn` to ensure the property exists directly on the
 * object rather than somewhere on the prototype chain.
 *
 * @example
 * if (isObject(value) && hasProp(value, 'id')) {
 *   // value.id now exists
 * }
 */
export function hasProp<TKey extends PropertyKey>(
  obj: Record<string, unknown>,
  key: TKey,
): obj is Record<TKey, unknown> {
  return Object.hasOwn(obj, key);
}
