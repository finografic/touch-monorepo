/**
 * Creates a Proxy that provides fallback values for indexed object properties
 *
 * This utility solves the problem of migrating from single values to indexed objects
 * while maintaining backward compatibility for existing usage.
 *
 * @param target - The object to wrap with fallback behavior
 * @param defaultKey - The key to use as fallback when no index is provided
 * @returns A Proxy that handles both indexed access and fallback conversion
 *
 * @example
 * ```typescript
 * const padding = createFallbackProxy(baseLayout.padding, 4);
 *
 * // Legacy usage (now works!)
 * `${padding}` // Returns '1rem' (index 4)
 *
 * // New usage (still works!)
 * `${padding[2]}` // Returns '0.5rem'
 * `${padding[4]}` // Returns '1rem'
 * ```
 */
export const createFallbackProxy = <T extends Record<string | number, string>>(
  target: T,
  defaultKey: keyof T,
): T => {
  return new Proxy(target, {
    get(target, prop) {
      // Handle numeric/string property access (e.g., obj[4], obj['base'])
      if (typeof prop === 'string' && (prop in target || !Number.isNaN(Number(prop)))) {
        return target[prop];
      }

      // Handle string conversion (e.g., `${obj}` in template literals)
      if (prop === Symbol.toPrimitive) {
        return () => target[defaultKey];
      }

      // Handle valueOf() calls
      if (prop === 'valueOf') {
        return () => target[defaultKey];
      }

      // Handle toString() calls
      if (prop === 'toString') {
        return () => target[defaultKey];
      }

      // Handle other property access (like Object.keys(), for...in loops)
      return target[prop as keyof T];
    },
  });
};
