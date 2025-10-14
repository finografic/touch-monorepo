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
  // Create a new object that inherits from target (for property access)
  const proxyTarget = Object.create(target);

  // Override string conversion methods to return the default value
  // These are called when the object is used in template literals or string context
  proxyTarget[Symbol.toPrimitive] = (hint: string) => target[defaultKey];
  proxyTarget.valueOf = () => target[defaultKey];
  proxyTarget.toString = () => target[defaultKey];

  // Return as T - the string conversion methods are hidden from TypeScript
  // but available at runtime for template literal coercion
  return proxyTarget as T;
};
