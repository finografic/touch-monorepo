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

  // Create a String object (primitive wrapper) - THIS is the key!
  // String objects can have properties AND are treated as strings by Emotion
  const str = new String(defaultValue) as any;

  // Copy all properties from target to the string object
  Object.keys(target).forEach((key) => {
    str[key] = target[key as keyof T];
  });

  // Debug: Log what we're creating (remove this later)
  if (typeof window !== 'undefined') {
    console.log('🎯 createCSSProxy:', { defaultKey, defaultValue, str, typeofStr: typeof str });
  }

  return str as T;
};
