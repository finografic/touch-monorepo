/**
Makes specific properties of a type optional while keeping others required.
@category Type
@example
```
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

type UserWithOptionalContact = OptionalProp<User, "email" | "phone">;
// Result: {
//   id: number;      // Required
//   name: string;    // Required
//   email?: string;  // Optional
//   phone?: string;  // Optional
// }
```
*/

export type OptionalProp<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/**
Makes specific properties of a type required by removing undefined/optional.
@category Type
@example
```
interface User {
  id?: number;
  name?: string;
  email: string;
}

type UserWithRequiredIdName = RequiredProp<User, "id" | "name">;
// Result: {
//   id: number;     // Required
//   name: string;   // Required
//   email: string;  // Unchanged
// }
```
*/
export type RequiredProp<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// -------------------------------------------------------------------------- //

// TODO: Future additions could include:
// - ReadonlyProp
// - NullableProp
