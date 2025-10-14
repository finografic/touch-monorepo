/**
 * Type that allows both direct string coercion AND indexed access
 * This is the magic that makes TypeScript happy with ${layout.padding} AND layout.padding[4]
 */
export type CSSProxyValue<T extends Record<string | number, string>> = T & {
  toString(): string;
  valueOf(): string;
  [Symbol.toPrimitive](hint: string): string;
};

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
 * @returns A proxy that behaves as both object AND string
 *
 * @example
 * ```typescript
 * const padding = createCSSProxy(baseLayout.padding, 4);
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
): CSSProxyValue<T> => {
  // Create a new object that inherits from target (for property access)
  const proxyTarget = Object.create(target) as CSSProxyValue<T>;

  // Override string conversion methods to return the default value
  // These are called when the object is used in template literals or string context
  proxyTarget[Symbol.toPrimitive] = (hint: string) => target[defaultKey];
  proxyTarget.valueOf = () => target[defaultKey];
  proxyTarget.toString = () => target[defaultKey];

  return proxyTarget;
};
