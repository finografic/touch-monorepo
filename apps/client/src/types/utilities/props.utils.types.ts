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

// -------------------------------------------------------------------------- //

// NOTE: Future additions could include:
// - RequiredProp
// - ReadonlyProp
// - NullableProp
