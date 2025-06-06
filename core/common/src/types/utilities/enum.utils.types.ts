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
Creates a readonly record type where values can be transformed from the key type.
Useful for creating type-safe enum-style objects with `as const`.
@category Type
@example
```
type OrderField = "drinkType" | "containerType";

// Simple 1:1 mapping
type OrderFieldMap = ConstMapOf<OrderField>;
const orderFields: ConstMapOf<OrderField> = {
  drinkType: "drinkType",
  containerType: "containerType"
} as const;

// With value transformation (e.g., to kebab-case)
type OrderFieldKebabMap = ConstMapOf<OrderField, CamelToKebab<OrderField>>;
const orderFieldsKebab: ConstMapOf<OrderField, CamelToKebab<OrderField>> = {
  drinkType: "drink-type",
  containerType: "container-type"
} as const;
```
*/

export type ConstMapOf<TKey extends string, TValueType extends string = TKey> = {
  readonly [K in TKey]: TValueType extends string ? Extract<TValueType, string> : never;
};

// -------------------------------------------------------------------------- //

/**
Creates an object type with keys from a string union type.
@category Type
@example
```
type Status = "pending" | "success" | "error";

// With default value type (unknown)
type StatusMap = MapIndex<Status>;
// Result: { pending: unknown; success: unknown; error: unknown }

// With specified value type
type StatusWithData = MapIndex<Status, boolean>;
// Result: { pending: boolean; success: boolean; error: boolean }
```
*/

export type MapIndex<TKey extends string, TValueType = unknown> = { [key in TKey]: TValueType };

// -------------------------------------------------------------------------- //

// NOTE: Future additions could include:
// - UnionToIntersection
// - UnionToTuple
// - StringLiteralUnion
