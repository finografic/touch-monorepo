// -------------------------------------------------------------------------- //

/**
 * Recursively converts a `snake_case` string to `camelCase`.
 * @template S - The string type to be converted.
 * @example
 * RESULT: 'example_string' becomes 'exampleString'
 */
export type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S;

// -------------------------------------------------------------------------- //

/**
 * Converts all keys of an object from `snake_case` to `camelCase`.
 * @template T - The object type whose keys are to be converted.
 * @example
 * RESULT: { user_id: string } becomes { userId: string }
 */
export type ConvertKeysToCamelCase<T> = {
  [K in keyof T as SnakeToCamel<string & K>]: T[K] extends object ? ConvertKeysToCamelCase<T[K]> : T[K];
};

// -------------------------------------------------------------------------- //

/**
 * Override specific type properties with new prop types, useful after type transformations.
 * @template T - The original type whose properties need to be overridden
 * @template U - The type containing the properties and their new types to override with
 *
 * @example
 * type Original = { foo: number; bar: string; baz: number };
 * type NewType = Override<Original, { foo: string; baz: boolean }>;
 * RESULT: { foo: string; bar: string; baz: boolean }
 */
export type Override<T, U> = Omit<T, keyof U> & U;

// ------------------------------------------------------------------------ //

export type RemoveIndexSignature<Obj extends Record<string, any>> = {
  [Key in keyof Obj as Key extends `${infer Str}` ? Str : never]: Obj[Key];
};
