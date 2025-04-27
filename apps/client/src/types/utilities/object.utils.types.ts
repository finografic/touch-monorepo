import { SnakeToCamel } from './casing.utils.types';
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

// NOTE: Future additions could include:
// - DeepPartial
// - RecursiveRequired
// - FlattenObject
