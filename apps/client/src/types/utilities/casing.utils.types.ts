/**
Recursively converts a `snake_case` string to `camelCase`.
@category Type
@example
```
type SnakeCase = "user_profile_data";
type Result = SnakeToCamel<SnakeCase>;
// Result: "userProfileData"

type DeepSnakeCase = "api_response_error_message";
type Result = SnakeToCamel<DeepSnakeCase>;
// Result: "apiResponseErrorMessage"
```
*/

export type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S;

// -------------------------------------------------------------------------- //

// NOTE: Future additions could include:
// - CamelToSnake
// - KebabToCamel
// - Capitalize/Uncapitalize (if needed beyond built-in)
