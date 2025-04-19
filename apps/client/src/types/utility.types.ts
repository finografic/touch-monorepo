/**
 * Recursively converts a `snake_case` string to `camelCase`.
 * @template S - The string type to be converted.
 * @example
 * // 'example_string' becomes 'exampleString'
 */
export type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S;

/**
 * Converts all keys of an object from `snake_case` to `camelCase`.
 * @template T - The object type whose keys are to be converted.
 * @example
 * // { user_id: string } becomes { userId: string }
 */
export type ConvertKeysToCamelCase<T> = {
  [K in keyof T as SnakeToCamel<string & K>]: T[K] extends object ? ConvertKeysToCamelCase<T[K]> : T[K];
};

// ======================================================================== //
/**
 * Utility type that overrides specific properties of a type with new types.
 * Useful for enforcing specific types on properties after type transformations.
 * @template T - The original type whose properties need to be overridden
 * @template U - The type containing the properties and their new types to override with
 *
 * @example
 * type Original = { foo: number; bar: string; baz: number };
 * type NewType = Override<Original, { foo: string; baz: boolean }>;
 * // Result: { foo: string; bar: string; baz: boolean }
 */
export type Override<T, U> = Omit<T, keyof U> & U;

// ======================================================================== //
/**
 * Enforces specific types for certain keys in an object type.
 * @template T - The original object type.
 * @template K - The keys in the object type for which to enforce a specific type.
 * @template U - The type to enforce for the specified keys.
 *
 * @example
 * type Original = { a: number | string; b: number | boolean; c: Date | string };
 * type Enforced = EnforceTypes<Original, 'a' | 'b', boolean>;
 * // Result: { a: boolean; b: boolean; c: Date | string }
 */
export type EnforceTypes<T, K extends keyof T, U> = {
  [P in keyof T]: P extends K ? U : T[P];
};
