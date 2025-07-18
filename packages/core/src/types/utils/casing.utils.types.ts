// ------------------------------------------------------------------------ //

/**
Recursively converts a `camelCase` string to `kebab-case`.
@category Type
@example
```
type CamelCase = "userProfileData";
type Result = CamelToKebab<CamelCase>;
// Result: "user-profile-data"

type DeepCamelCase = "apiResponseErrorMessage";
type Result = CamelToKebab<DeepCamelCase>;
// Result: "api-response-error-message"
```
*/
export type CamelToKebab<S extends string> = S extends `${infer C}${infer T}`
  ? T extends Uncapitalize<T>
    ? `${Uncapitalize<C>}${CamelToKebab<T>}`
    : `${Uncapitalize<C>}-${CamelToKebab<T>}`
  : S;

// ------------------------------------------------------------------------ //

/**
Recursively converts a `kebab-case` string to `camelCase`.
@category Type
@example
```
type KebabCase = "user-profile-data";
type Result = KebabToCamel<KebabCase>;
// Result: "userProfileData"

type DeepKebabCase = "api-response-error-message";
type Result = KebabToCamel<DeepKebabCase>;
// Result: "apiResponseErrorMessage"
```
*/
export type KebabToCamel<S extends string> = S extends `${infer T}-${infer U}`
  ? `${T}${Capitalize<KebabToCamel<U>>}`
  : S;

// ------------------------------------------------------------------------ //

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

// ------------------------------------------------------------------------ //

/**
Recursively converts a `camelCase` string to `snake_case`.
@category Type
@example
```
type CamelCase = "userProfileData";
type Result = CamelToSnake<CamelCase>;
// Result: "user_profile_data"

type DeepCamelCase = "apiResponseErrorMessage";
type Result = CamelToSnake<DeepCamelCase>;
// Result: "api_response_error_message"
```
*/
export type CamelToSnake<S extends string> = S extends `${infer C}${infer T}`
  ? T extends Uncapitalize<T>
    ? `${Uncapitalize<C>}${CamelToSnake<T>}`
    : `${Uncapitalize<C>}_${CamelToSnake<T>}`
  : S;

// ------------------------------------------------------------------------ //

/**
Recursively converts a `kebab-case` string to `SCREAMING_SNAKE_CASE`.
@category Type
@example
```
type KebabCase = "user-profile-data";
type Result = KebabToScreamingSnake<KebabCase>;
// Result: "USER_PROFILE_DATA"

type DeepKebabCase = "api-response-error-message";
type Result = KebabToScreamingSnake<DeepKebabCase>;
// Result: "API_RESPONSE_ERROR_MESSAGE"
```
*/
export type KebabToScreamingSnake<S extends string> = S extends `${infer T}-${infer U}`
  ? `${Uppercase<T>}_${KebabToScreamingSnake<U>}`
  : Uppercase<S>;

/**
Recursively converts a `SCREAMING_SNAKE_CASE` string to `kebab-case`.
@category Type
@example
```
type ScreamingSnakeCase = "USER_PROFILE_DATA";
type Result = ScreamingSnakeToKebab<ScreamingSnakeCase>;
// Result: "user-profile-data"

type DeepScreamingSnake = "API_RESPONSE_ERROR_MESSAGE";
type Result = ScreamingSnakeToKebab<DeepScreamingSnake>;
// Result: "api-response-error-message"
```
*/
export type ScreamingSnakeToKebab<S extends string> = S extends `${infer T}_${infer U}`
  ? `${Lowercase<T>}-${ScreamingSnakeToKebab<U>}`
  : Lowercase<S>;

// -------------------------------------------------------------------------- //

// NOTE: Future additions could include:
// - Capitalize/Uncapitalize (if needed beyond built-in)
