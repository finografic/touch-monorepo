# App Configuration System

This document describes the **app-level configuration** feature: a small key/value store in the database that drives UI behaviour (e.g. grid layout mode, future toggles for button visibility). It summarizes database schema, server API, client usage, and how the first switch (“Minimal grid layout”) works end-to-end.

---

## 1. Database

**Table:** `app_configuration`

| Column       | Type    | Description                                      |
| ------------ | ------- | ------------------------------------------------ |
| `id`         | text    | Primary key (CUID)                               |
| `name`       | text    | Unique key (e.g. `grid_layout`)                   |
| `is_active`  | integer | Boolean (0/1); used as toggle state               |
| `data`       | text    | JSON object for optional config-specific fields  |
| `created_at` | text    | Timestamp                                        |
| `updated_at` | text    | Timestamp                                        |

- **Migration:** `data/migrations/0001_app_configuration.sql`
- **Schema (Drizzle):** `apps/server/src/db/schemas/app_configuration.schema.ts`
- **Seed:** `apps/server/src/db/seeds/app_configuration.seed.ts` — inserts one row: `name: 'grid_layout'`, `is_active: 0`, `data: '{}'`. Seeded first in `config/db-setup.config.ts`.

---

## 2. Server Endpoints

**Base path:** `/app-configuration` (under API base path, e.g. `/api/app-configuration`)

| Method | Path                        | Description                    |
| ------ | --------------------------- | ------------------------------ |
| GET    | `/app-configuration`        | List all app config entries    |
| GET    | `/app-configuration/:id`    | Get one by CUID                |
| GET    | `/app-configuration/key/:name` | Get one by key (e.g. `grid_layout`) |
| PATCH  | `/app-configuration/:id`    | Partial update (`isActive`, `data`) |

**Implementation:**

- **Routes:** `apps/server/src/routes/app-configuration/app-configuration.routes.ts`
- **Handlers:** `apps/server/src/routes/app-configuration/app-configuration.handlers.ts`
- **Router:** `apps/server/src/routes/app-configuration/index.ts` (mounted in `app.ts`)

**PATCH body:** `{ isActive?: boolean, data?: Record<string, unknown> }`. Responses return the full row with `data` parsed from JSON text.

---

## 3. Client Endpoint Helper

**File:** `apps/client/src/api/endpoints/app-configuration.endpoints.ts`

**Exports:** `appConfigurationEndpoints` (and re-exported from `api/endpoints/index.ts`)

| Method      | Description                          |
| ----------- | ------------------------------------ |
| `getAll()`  | GET list                             |
| `getById(id)` | GET by CUID                        |
| `getByKey(name)` | GET by key (e.g. `'grid_layout'`) |
| `update(id, { isActive?, data? })` | PATCH one entry              |

**Types:** `apps/client/src/types/app-configuration.types.ts` — `AppConfiguration`, `UpdateAppConfigurationRequest`. Shared entity shape also exported from `config/app-configuration.entity.ts` as `AppConfigurationEntity`.

---

## 4. React Query Hooks

**Folder:** `apps/client/src/queries/app-configuration/`

| File                          | Hook                         | Purpose                          |
| ----------------------------- | ---------------------------- | --------------------------------- |
| `useGetAppConfigurations.ts`  | `useGetAppConfigurations()`  | Fetch all entries                 |
| `useGetAppConfigurationByKey.ts` | `useGetAppConfigurationByKey(key)` | Fetch one by key (e.g. `'grid_layout'`) |
| `useUpdateAppConfiguration.ts` | `useUpdateAppConfiguration()` | PATCH mutation; invalidates list + detail |

**Query keys:** `APP_CONFIGURATION_QUERY_KEYS` in `index.ts` (all, list, detail(key)).

---

## 5. UI Switch: “Minimal layout (4 slots, 2×2)”

### Purpose

- **Config key:** `grid_layout`
- **Meaning of `is_active`:**
  - `false` → **Standard grid:** 3 rows, N columns from `calculateColumns(activeSlotCount)`, last active slot shown as a separate “special” slot (Type C, red).
  - `true` → **Minimal grid:** fixed 2×2, 4 slots only, no separate special slot (no extra red button).

The switch lets admins choose between the standard main-page grid and a minimal layout (4 slots, 2 columns × 2 rows) that persists across sessions and devices.

### Where the switch lives

- **Page:** `apps/client/src/admin/pages/AdminSlotsConfigPage/AdminSlotsConfigPage.tsx`
- **Location:** Right column, under the slot type legend (Type A/B/C), in a “Layout mode” block.
- **Behaviour:**
  - Uses `useGetAppConfigurationByKey('grid_layout')` and `useUpdateAppConfiguration()`.
  - Switch `checked` = `gridLayoutConfig?.isActive ?? false`.
  - On toggle: PATCH the `grid_layout` row with `{ isActive: checked }`, then show success/error toast.
  - When minimal: subtitle “2×2 minimal”, Add/Remove column buttons disabled, SlotGrid preview shows 4 slots in 2×2.

### How it renders on the frontend app (MainPage)

- **Page:** `apps/client/src/pages/MainPage/MainPage.tsx`
- **Data:** `useGetAppConfigurationByKey('grid_layout')` → `isMinimalLayout = gridLayoutConfig?.isActive ?? false`.
- **Logic:**
  - **If minimal:** `slotsForGrid` = first 4 active slots from `slotsConfig`; `columns = 2`, `rows = 2`; `MainPageSlotGrid` receives `minimalLayout={true}`.
  - **If standard:** `slotsForGrid` = all active slots; `columns = calculateColumns(activeSlots.length)`; `rows = NUM_ROWS_DEFAULT`; `minimalLayout={false}` (default).
- **Grid component:** `apps/client/src/pages/MainPage/MainPageSlotGrid/MainPageSlotGrid.tsx`
  - When `minimalLayout === true`: all given slots are rendered in the grid; no “last” slot is drawn in the sidebar (only the power control remains).
  - When `minimalLayout === false`: same as before — last active slot is rendered separately as the special (red) slot.

So the Admin switch directly controls what the main app shows: standard grid vs minimal 4-slot 2×2 with no extra red button.

---

## 6. TODO: Adding More Switches (Toggle Other Buttons’ Visibility)

**Goal:** Add 2–3 more app_configuration switches that control visibility (or availability) of other UI elements (e.g. buttons) in the frontend app, following the same pattern as `grid_layout`.

**General instructions for an Agent:**

1. **Database / seed**
   - No new table needed. Add one new row in `app_configuration.seed.ts` (or a follow-up seed/migration) with a new `name` (e.g. `show_xyz_button`), `is_active: false`, `data: '{}'`. Ensure the seed runs (e.g. via db-setup or manual seed).

2. **Server**
   - No new endpoints required. Existing GET-by-key and PATCH support any key; the new row is read/updated via `GET /app-configuration/key/:name` and `PATCH /app-configuration/:id`.

3. **Client**
   - **Types:** Reuse `AppConfiguration` and `UpdateAppConfigurationRequest`; no new types unless the new switch stores extra fields in `data`.
   - **Endpoints:** Reuse `appConfigurationEndpoints.getByKey(name)` and `appConfigurationEndpoints.update(id, { isActive })`.
   - **Queries:** Reuse `useGetAppConfigurationByKey(key)` and `useUpdateAppConfiguration()`. Use a stable key string (e.g. `'show_xyz_button'`).

4. **Admin UI (switch)**
   - Choose an admin page (e.g. same Slot Config page, or a dedicated “App options” page).
   - Add a Switch (or similar) that:
     - Reads state from `useGetAppConfigurationByKey('your_key')` → `config?.isActive ?? false`.
     - On toggle, calls `useUpdateAppConfiguration().mutateAsync({ id: config.id, data: { isActive: checked } })`, then toast on success/error.
   - Optionally disable other controls or change copy when the toggle is on, for consistency.

5. **Frontend app (where the button is)**
   - In the component that renders the target button(s):
     - Call `useGetAppConfigurationByKey('your_key')` and derive e.g. `isVisible = config?.isActive ?? false` (or invert if the key means “hide when active”).
   - Render the button (or wrapper) only when `isVisible` is true (e.g. `{isVisible && <Button ... />}`), or set `disabled` / `aria-hidden` instead of hiding, depending on product requirements.

6. **Naming and keys**
   - Use a clear, unique `name` in `app_configuration` (e.g. `show_orders_button`, `show_snooze_button`). Document the key and meaning in this file or in a short comment next to the switch.

7. **Optional: shared key constants**
   - If keys are used in more than one place, define a constant (e.g. `APP_CONFIG_KEYS.showXyzButton = 'show_xyz_button'`) in a shared module or next to the first use, and use it in both Admin and MainPage (or other consumers).

Following this pattern keeps new switches consistent with the existing grid_layout implementation and avoids new tables or new API surface.
