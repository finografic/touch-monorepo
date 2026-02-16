# Q

```
Now, it has to do with the slot configuration that is managed in the Admin section via @AdminSlotsConfigPage.tsx , saved to the DB, and read by @apps/client/src/pages/MainPage/MainPage.tsx ...

The admin has TWO BUTTONS:
- remove column
- add column

There is a COMMON method that uses the stored DB configuration to parse and render the grid both in MainPage.tsx, AND i think the @apps/client/src/admin/pages/AdminSlotsConfigPage/AdminSlotsConfigPage.tsx , @SlotGrid.tsx ..

Can you please confirm the precense of this method ??
It does exists, but where is it located, and is it shared in both fron and admin ?

```

---

# A: Here’s what’s shared and what isn’t

## Shared: grid iteration and layout

**`utils/grid.utils.ts`** – **`mapGridByColumns`**

- **Used by both:**
  - **Front (MainPage):** `MainPageSlotGrid.tsx` (line 44) – iterates in column-major order and renders each cell with `PadSlot`.
  - **Admin:** `admin/pages/AdminSlotsConfigPage/SlotGrid/SlotGrid.tsx` (line 101) – same iteration, renders each cell with `SlotButton`.

So the **common method that parses the grid layout (rows × columns) and drives rendering** is **`mapGridByColumns`** in **`apps/client/src/utils/grid.utils.ts`**. It takes `{ rows, columns }` and a callback `(slotNumber) => ...`, and both the main app and admin use it to build the grid.

Shared config used by both:

- **`config/app/slots.config.ts`** – `NUM_ROWS_DEFAULT` (3), `MIN_COLUMNS`, `MAX_COLUMNS`, `NUM_RELAYS`, `DEFAULT_SLOTS_CONFIG`.

---

## Not shared: column count from DB config

**Column calculation:**

| Place | How columns are computed |
|--------|---------------------------|
| **Admin** (`AdminSlotsConfigPage.tsx`) | **`calculateColumns(activeSlotCount)`** from **`utils/slots.utils.ts`** (with MIN/MAX clamping). |
| **MainPage** (`MainPage.tsx`) | Inline: **`Math.floor((totalSlots - 1) / NUM_ROWS_DEFAULT)`** (no clamp). |

So:

- The **grid rendering** (how rows/columns are iterated and where each slot goes) **is** shared via `mapGridByColumns`.
- The **logic that turns “active slot count” into “number of columns”** is **not** fully shared: only Admin uses `calculateColumns`; MainPage uses its own formula.

---

## Data flow (same source, different hooks)

- **Front:** `useSlotItemsConfig()` → `useGetSlotConfigurations()` → DB; returns `allSlots` / `items` used by MainPage and `MainPageSlotGrid`.
- **Admin:** `useGetSlotConfigurations()` directly → same DB; form state is synced from that and passed to `SlotGrid`.

So the **stored DB configuration is read in both front and admin**; the shared piece for **parsing and rendering the grid** is **`mapGridByColumns`** in **`utils/grid.utils.ts`**, and it is used in both places. Column count could be unified by having MainPage use **`calculateColumns`** from **`utils/slots.utils.ts`** instead of its inline formula, if you want one shared rule for “active slots → columns.”
