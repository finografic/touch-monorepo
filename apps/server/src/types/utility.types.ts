/**
Creates a map type for enum-style constants,
where keys are UPPERCASE versions of union members.

@example
type CarModel = "ferrari" | "mercedes" | "volvo";

const = EnumFromType = ConstEnumOf<CarModel> = {
  FERRARI: "ferrari",
  MERCEDES: "mercedes",
  VOLVO: "volvo",
} as const; <-- `as const` already applied via `readonly`

@category Type
 */
// NOTE: ✅ this one is a keeper!!
// TODO: PRESERVE CASING of T.. 🤔
export type ConstEnumOf<T extends string> = { readonly [K in Uppercase<T>]: Lowercase<K> };

export type ConstUpperEnumOf<T extends string> = { readonly [K in Uppercase<T>]: Uppercase<K> };

export type MapIndex<T extends string> = Record<T, unknown>;

export type LetterChars = Lowercase<Letters> | Uppercase<Letters>;

type Letters =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';
