# TODO: Temperature-related names (for search/replace to match DB keys)

DB column names: `default_temp_consume`, `default_temp_freeze`

Use this list when renaming constants/properties to align with DB key names. Format: `file path` | `variable name` | inferred usage

---

## Client – default_temp_* / defaultTemp* (property names)

| File path | Variable / property name | Inferred usage |
|-----------|--------------------------|----------------|
| apps/client/src/admin/pages/Translations/TranslationsProductPage/TranslationsTable/hooks/useTranslationsTableHandlers.ts | defaultTempConsume, defaultTempFreeze | Form item payload comparison for “actually changed” |
| apps/client/src/admin/pages/Translations/TranslationsProductPage/hooks/useSaveProductTranslations.ts | defaultTempConsume, defaultTempFreeze | Create/update payloads for drink types & subtypes; clampTempConsume / clampTempFreeze |
| apps/client/src/admin/pages/Translations/TranslationsProductPage/TranslationsTable/TranslationsTableExpandable.tsx | defaultTempConsume, defaultTempFreeze | Defaults when appending new subtype row (5, -2) |
| apps/client/src/admin/pages/AdminProductsPage/OrdersForm/OrdersForm.tsx | defaultTempConsume, defaultTempFreeze | Form field names, initial values, setValue, validation |
| apps/client/src/admin/pages/AdminProductsPage/OrdersForm/OrdersForm.schema.ts | defaultTempConsume, defaultTempFreeze | Zod schema field names and validation |
| apps/client/src/admin/pages/AdminProductsPage/OrdersForm/orders-form.submission.ts | defaultTempConsume, defaultTempFreeze | Submission payload to API |
| apps/client/src/admin/pages/AdminProductsPage/OrdersForm/useAddNewItemHandlers.ts | defaultTempConsume, defaultTempFreeze | Defaults when adding new order items |
| apps/client/src/admin/pages/AdminProductsPage/OrdersForm/mock-orders.utils.ts | defaultTempFreeze, defaultTempConsume | Param name, setValue keys, mock payload |
| apps/client/src/admin/pages/AdminProductsPage/OrdersForm/TimesRepeaterTable/TimesRepeaterTable.tsx | defaultTempFreeze | From form values; passed to child |
| apps/client/src/admin/pages/AdminProductsPage/OrdersForm/TimesRepeaterTable/RepeatersTableRow/RepeaterTableRow.tsx | defaultTempFreeze | Prop type and min constraint for temperature |
| apps/client/src/admin/pages/AdminProductsPage/OrdersTable/OrdersTable.tsx | defaultTempConsume | Column field, filter, display |
| apps/client/src/admin/pages/AdminProductsPage/OrdersTable/OrdersTable.config.tsx | defaultTempConsume | Table column field |
| apps/client/src/admin/pages/AdminProductsPage/hooks/useOrdersFilter.ts | defaultTempConsume | Filter by search string |
| apps/client/src/admin/pages/AdminProductsPage/OrdersTable/mocks/TabList.EXAMPLE.tsx | defaultTempConsume | Example filter |
| apps/client/src/admin/hooks/useTableHeaders.ts | defaultTempConsume | Table header key mapping |
| apps/client/src/api/endpoints/orders.endpoints.ts | defaultTempConsume, defaultTempFreeze | Order type and update payload |
| apps/client/src/api/endpoints/drink-type.endpoints.ts | defaultTempConsume, defaultTempFreeze | Fallback defaults in PATCH body |
| apps/client/src/queries/drink-types/DrinkTypes.dto.ts | defaultTempConsume, defaultTempFreeze; default_temp_consume, default_temp_freeze | Map DB columns → camelCase; map request → DB keys |
| apps/client/src/queries/drink-types/useCreateDrinkType.ts | defaultTempConsume, defaultTempFreeze | Mutation input type and body |
| apps/client/src/queries/drink-types/useCreateDrinkSubtype.ts | defaultTempConsume, defaultTempFreeze | Mutation input type and body |
| apps/client/src/queries/drink-types/useUpdateDrinkType.ts | defaultTempConsume, defaultTempFreeze | Update payload type |
| apps/client/src/queries/drink-types/useUpdateDrinkSubtype.ts | defaultTempConsume, defaultTempFreeze | Update payload type |
| apps/client/src/hooks/buttons/useNavigationButtons.ts | defaultTempConsume, defaultFreeze (defaultTempFreeze) | Pass order temps into navigation state (defaultConsume, defaultFreeze) |
| apps/client/src/pages/TemperaturePage/useTemperatureFormAndFilter.ts | defaultTempConsume | From filtered order data; used for temp defaults |
| apps/client/src/config/ui/pads-ui.config.ts | defaultTempConsume | valueKeys for drink type / subtype display |
| apps/client/src/forms/FormMiddleware/README.FormMiddleware.md | defaultTempConsume, defaultTempFreeze | Example field names and middleware targetField |
| apps/client/src/forms/FormMiddleware/OrdersFormConfig.example.ts | defaultTempConsume, defaultTempFreeze | Example dynamicMax / calculate |
| apps/client/src/dev-tools/mocks/MockOrdersButton/useGenerateRealMockData.ts | defaultTempConsume, defaultTempFreeze | From drink type/subtype entity; mock payload |
| apps/client/src/dev-tools/mocks/MockOrdersButton/mock-orders.data.ts | defaultTempConsume | Mock drink type/subtype defaults |
| packages/i18n/translations/admin/en-GB.json | defaultTempConsume | Translation key (label “Temperature”) |
| packages/i18n/translations/admin/es-ES.json | defaultTempConsume | Translation key |
| packages/i18n/translations/admin/ca-ES.json | defaultTempConsume | Translation key |

---

## Client – temp min/max/default constants (TEMP_CONSUME_*, FINAL_TEMP_*, TEMP_*_MIN/MAX, etc.)

| File path | Variable name | Inferred usage |
|-----------|---------------|----------------|
| apps/client/src/config/app/temperature.config.ts | TEMP_CONSUME_DEFAULT, TEMP_CONSUME_MIN, TEMP_CONSUME_MAX, FINAL_TEMP_DEFAULT, FINAL_TEMP_MIN, FINAL_TEMP_MAX, MIN_TEMP_DIFFERENCE | App-level temp defaults and bounds (temperature page / flow) |
| apps/client/src/admin/pages/Translations/TranslationsProductPage/hooks/useSaveProductTranslations.ts | TEMP_CONSUME_MIN, TEMP_CONSUME_MAX, TEMP_FREEZE_MIN, TEMP_FREEZE_MAX | Clamp bounds for drink type/subtype schema (-10..30 consume, -20..10 freeze) |
| apps/client/src/forms/FormMiddleware/FormMiddleware.constants.ts | DEFAULT_TEMP_MIN, DEFAULT_TEMP_MAX, TEMP_CONSUME_MAX, TEMP_STEP | Input constraints and step for temperature fields |
| apps/client/src/forms/InputTemperature/InputTemperature.tsx | DEFAULT_TEMP_MIN, DEFAULT_TEMP_MAX, TEMP_STEP | Fallback min/max and step for input |
| apps/client/src/forms/TemperatureInputField/TemperatureInputField.tsx | DEFAULT_TEMP_MIN, DEFAULT_TEMP_MAX, TEMP_STEP | Default min, max, step props |
| apps/client/src/pages/TemperaturePage/useTemperatureFormAndFilter.ts | TEMP_CONSUME_DEFAULT, TEMP_FREEZE_DEFAULT, MIN_TEMP_DIFFERENCE | Filter defaults and next-button validation |
| apps/client/src/pages/TemperaturePage/TemperaturePage.tsx | TEMP_CONSUME_DEFAULT, MIN_TEMP_DIFFERENCE | Initial state and final max (initial - MIN_TEMP_DIFFERENCE) |
| apps/client/src/pages/TemperaturePage/TemperatureForm.tsx | MIN_TEMP_DIFFERENCE | Max final temp = initial - MIN_TEMP_DIFFERENCE |
| apps/client/src/admin/pages/AdminProductsPage/OrdersForm/OrdersForm.tsx | MIN_TEMP_DIFFERENCE | Max freeze temp = consume - MIN_TEMP_DIFFERENCE |
| apps/client/src/admin/pages/AdminProductsPage/OrdersForm/OrdersForm.schema.ts | MIN_TEMP_DIFFERENCE | Refine: freeze <= consume - MIN_TEMP_DIFFERENCE |

---

## Server – default_temp_* (DB columns) and defaultTemp* (Zod/API)

| File path | Variable name | Inferred usage |
|-----------|---------------|----------------|
| apps/server/src/db/schemas/drink_types.schema.ts | defaultTempConsume, defaultTempFreeze (Drizzle); integer('default_temp_consume'), integer('default_temp_freeze') | Table definition and Zod insert schema |
| apps/server/src/db/schemas/drink_subtypes.schema.ts | defaultTempConsume, defaultTempFreeze (Drizzle); integer('default_temp_consume'), integer('default_temp_freeze') | Table definition and Zod insert schema |
| apps/server/src/db/schemas/orders.schema.ts | defaultTempConsume, defaultTempFreeze (Drizzle); default_temp_consume, default_temp_freeze | Orders table and Zod; uses TEMPERATURE_RANGES |
| apps/server/src/db/seeds/drink_types.seed.ts | defaultTempConsume, defaultTempFreeze | Seed data for drink_types and drink_subtypes |
| apps/server/src/db/seeds/orders.seed.ts | defaultTempConsume, defaultTempFreeze | Seed payload; uses TEMPERATURE_RANGES |
| apps/server/src/routes/orders/orders.routes.ts | defaultTempConsume, defaultTempFreeze | Zod schema for order body |
| apps/server/src/routes/orders/orders.handlers.ts | defaultTempConsume, defaultTempFreeze; default_temp_consume AS defaultTempConsume, default_temp_freeze AS defaultTempFreeze | Select list alias DB → camelCase; read result |
| apps/server/src/types/entities/order.entity.ts | default_temp_consume, default_temp_freeze | Entity type (DB column names) |
| apps/server/src/types/entities/order-readable.entity.ts | default_temp_consume, default_temp_freeze | Readable view entity |
| apps/server/src/types/entities/drink-type.entity.ts | default_temp_consume, default_temp_freeze | Drink type and subtype entity types |
| apps/server/src/db/views/orders_readable.sql | default_temp_consume, default_temp_freeze | SQL view columns |
| apps/server/src/db/DB.VIEW--orders_viewable.md | default_temp_consume, default_temp_freeze | Doc of view columns |

---

## Data / migrations (DB schema – do not rename column names here unless migrating)

| File path | Variable name | Inferred usage |
|-----------|---------------|----------------|
| data/migrations/0000_omniscient_joshua_kane.sql | default_temp_consume, default_temp_freeze | Column names in drink_types, drink_subtypes, orders |
| data/migrations/meta/0000_snapshot.json | default_temp_consume, default_temp_freeze | Drizzle snapshot metadata |

---

## Docs / examples (reference only)

| File path | Variable name | Inferred usage |
|-----------|---------------|----------------|
| docs/ZOD_TO_STANDARD_SCHEMA_MIGRATION.md | defaultTempConsume, default_temp_consume | Example schema migration |
| docs/FormMiddleware-System.md | defaultTempConsume, defaultTempFreeze, DEFAULT_TEMP_MIN, DEFAULT_TEMP_MAX, TEMP_STEP, MIN_TEMP_DIFFERENCE | Form middleware examples |
| apps/client/src/api/API_ENDPOINTS_AND_QUERIES_GUIDE.md | defaultTempConsume, defaultTempFreeze | API guide examples |
| apps/client/src/pages/TemperaturePage/TEMPERATURE_SYSTEM_ANALYSIS.md | defaultTempConsume, defaultTempFreeze | Analysis doc |
| apps/client/src/pages/TemperaturePage/TEMPERATURE_PAGE_FLOW.md | defaultTempConsume, TEMP_CONSUME_DEFAULT, FINAL_TEMP_*, etc. | Flow doc |
| apps/client/src/forms/TemperatureInputField/TEMPERATURE_INPUT_MIGRATION.md | MIN_TEMP_DIFFERENCE | Migration notes |
| apps/server/src/routes/temperature-profile/docs/README.EN.temperature.md | default_temp_consume, default_temp_freeze, min_temp_consume, max_temp_consume | Temperature profile docs |
| apps/server/src/routes/temperature-profile/docs/README.ES.temperature.md | (same) | Same, Spanish |

---

## Server – other temp config (different concept: order temp ranges)

| File path | Variable name | Inferred usage |
|-----------|---------------|----------------|
| apps/server/src/config/temperature.config.ts | TEMPERATURE_RANGES (CONSUMPTION.MIN/MAX, FREEZING.MIN/MAX) | Order seed and orders schema validation (not default_temp_* column names) |

---

## Cursor / ESLint rules (examples)

| File path | Variable name | Inferred usage |
|-----------|---------------|----------------|
| .cursor/rules/10-eslint-code-style.md | MIN_TEMP_DIFFERENCE | Example import from config/app |

---

**Summary for rename to match DB keys**

- **DB column names (keep as-is in SQL/migrations/snapshots):** `default_temp_consume`, `default_temp_freeze`
- **Code to align:** All **camelCase** usages (`defaultTempConsume`, `defaultTempFreeze`) that represent these two concepts can be renamed to the DB key style you choose (e.g. `default_temp_consume` / `default_temp_freeze` in TS/API if you want code to match DB).
- **Constants:** Names like `TEMP_CONSUME_MIN`, `TEMP_FREEZE_MAX`, `TEMP_CONSUME_DEFAULT`, `FINAL_TEMP_MIN`, etc. are separate from the DB column names; rename only if you want them to follow a single naming convention (e.g. all snake_case or all prefixed the same way).
