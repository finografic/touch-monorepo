import type { SnakeToCamel } from './casing.utils.types';
/**
Converts all keys of an object from `snake_case` to `camelCase`.
@category Type
@example
```
type ApiResponse = {
  user_id: number;
  profile_data: {
    first_name: string;
    last_name: string;
    email_address: string;
  }
};

type ClientResponse = ConvertKeysToCamelCase<ApiResponse>;
// Result: {
//   userId: number;
//   profileData: {
//     firstName: string;
//     lastName: string;
//     emailAddress: string;
//   }
// }
```
*/

export type ConvertKeysToCamelCase<T> = {
  [K in keyof T as SnakeToCamel<string & K>]: T[K] extends object ? ConvertKeysToCamelCase<T[K]> : T[K];
};

// -------------------------------------------------------------------------- //

/**
Removes index signatures from a type while preserving specific properties.
@category Type
@example
```
interface DataMap {
  id: number;
  name: string;
  [key: string]: any;  // Index signature
}

type CleanDataMap = RemoveIndexSignature<DataMap>;
// Result: {
//   id: number;
//   name: string;
// }
```
*/

export type RemoveIndexSignature<Obj extends Record<string, any>> = {
  [Key in keyof Obj as Key extends `${infer Str}` ? Str : never]: Obj[Key];
};

// -------------------------------------------------------------------------- //

/**
Override specific type properties with new prop types, useful after type transformations.
@category Type
@example
```
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

type UpdatedUser = OverridePropTypes<User, {
  id: string;      // Change id to string
  age: string;     // Change age to string
}>;
// Result: {
//   id: string;    // ← Changed
//   name: string;  // ← Unchanged
//   age: string;   // ← Changed
//   email: string; // ← Unchanged
// }
```
*/

export type OverridePropTypes<T, U> = Omit<T, keyof U> & U;

// -------------------------------------------------------------------------- //

/**
Type guard that checks if an object has any optional (undefined) properties.
@category Type Guard
@example
```
interface User {
  id: string;
  name: string;
  email?: string;
}

const user: User = { id: '1', name: 'John' };

if (hasOptionalProperties(user)) {
  // TypeScript knows some properties are undefined here
  console.log('User has optional properties');
}
```
*/
export function hasOptionalProperties<T extends Record<string, unknown>>(
  obj: T,
): obj is T & { [K in keyof T]: undefined extends T[K] ? T[K] : T[K] } {
  return Object.values(obj).includes(undefined);
}

// -------------------------------------------------------------------------- //

// NOTE: Future additions could include:
// - DeepPartial
// - RecursiveRequired
// - FlattenObject
