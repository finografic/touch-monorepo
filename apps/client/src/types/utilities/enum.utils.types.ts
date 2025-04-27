/**
Creates a map type for enum-style constants, here keys are UPPERCASE versions of union members.
@category Type
@example
```
type CarModel = "Ferrari" | "Mercedes" | "bmw";

const EnumFromType: ConstEnumOf<CarModel> = {
  FERRARI: "Ferrari",
  MERCEDES: "Mercedes",
  BMW: "bmw",
} as const; // <-- `as const` already applied via `readonly`
```
*/

export type ConstEnumOf<T extends string> = { readonly [K in Uppercase<T>]: Extract<T, string> };

// -------------------------------------------------------------------------- //

/**
Creates an object type with keys from a string union type.
@category Type
@example
```
type Status = "pending" | "success" | "error";

type StatusMap = MapIndex<Status>;
// Result: { pending: unknown; success: unknown; error: unknown }
```
*/

export type MapIndex<T extends string> = { [key in T]: unknown };

// -------------------------------------------------------------------------- //

// NOTE: Future additions could include:
// - UnionToIntersection
// - UnionToTuple
// - StringLiteralUnion
