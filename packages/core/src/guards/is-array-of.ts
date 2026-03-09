/**
 * Checks that a value is an array where every element
 * satisfies the provided type guard.
 *
 * @example
 * isArrayOf(data, isUser)
 */
export function isArrayOf<T>(value: unknown, guard: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(guard);
}
