/**
 * Creates a CSS-safe proxy that works with BOTH:
 * 1. Direct interpolation: ${layout.padding} → default value
 * 2. Indexed access: layout.padding[4] → specific value
 *
 * This solves the problem of accessing design system values in Emotion CSS-in-JS
 * without needing to use array notation for the default case.
 *
 * @param target - The object containing all available values
 * @param defaultKey - The key to use when the object is coerced to string
 * @returns A value that behaves as both object AND string
 *
 * @example
 * ```typescript
 * const padding = createCSSProxy(padding, 4);
 *
 * // Direct usage (gets default)
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

  // Create an object that inherits from String.prototype
  // This gives us string methods without the ESLint error
  const str = Object.create(String.prototype) as any;

  // Set the primitive value
  str.valueOf = () => defaultValue;
  str.toString = () => defaultValue;
  str[Symbol.toPrimitive] = () => defaultValue;

  // Copy all properties from target to the string-like object
  Object.keys(target).forEach((key) => {
    str[key] = target[key as keyof T];
  });

  return str as T;
};
