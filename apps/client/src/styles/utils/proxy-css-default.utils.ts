/**
 * Creates a CSS-safe proxy that works with BOTH:
 * 1. Direct interpolation: ${layout.padding} → default value
 * 2. Indexed access: layout.padding[4] → specific value
 *
 * This solves the problem of accessing design system values in Emotion CSS-in-JS
 * without needing to use array notation for the default case.
 *
 * The return type is `T` but with runtime string coercion methods added.
 * TypeScript treats it as the object type for property access, but JavaScript
 * automatically calls toString() in template literal contexts.
 *
 * @param target - The object containing all available values
 * @param defaultKey - The key to use when the object is coerced to string
 * @returns A proxy that behaves as both object AND string
 *
 * @example
 * ```typescript
 * const padding = createCSSProxy(baseLayout.padding, 4);
 *
 * // Direct usage (gets default) - TypeScript sees this as valid!
 * css`padding: ${padding};` // → '1rem'
 *
 * // Indexed usage (gets specific value)
 * css`padding: ${padding[2]};` // → '0.5rem'
 * css`padding: ${padding[8]};` // → '2rem'
 * ```
 */
export const createCSSProxy = <T extends Record<string | number, string>>(
  target: T,
  defaultKey: keyof T,
): T => {
  // Get the default value upfront
  const defaultValue = String(target[defaultKey]);

  // Use an actual Proxy to intercept property access
  return new Proxy(target, {
    get(target, prop) {
      // Handle string conversion for template literals
      if (prop === Symbol.toPrimitive) {
        return (hint: string) => defaultValue;
      }
      if (prop === 'valueOf') {
        return () => defaultValue;
      }
      if (prop === 'toString') {
        return () => defaultValue;
      }

      // Handle property access (e.g., padding[4], padding.lg)
      return target[prop as keyof T];
    },

    // Handle Object.keys(), for...in, JSON.stringify() - return empty to avoid enumeration
    ownKeys() {
      return [];
    },

    // Make the proxy appear to have no enumerable properties
    getOwnPropertyDescriptor(target, prop) {
      return undefined;
    },
  }) as T;
};
