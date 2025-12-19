# i18next: Database-backed Translations with Domains

### Overview

This project uses **i18next with a single namespace** backed entirely by **database-stored translations**, while preserving **clear ownership and structure** via **domain-prefixed keys**.

* **Namespace**: `translations`
* **Domains**: `ui`, `app`, `admin`
* **Storage**: SQLite (via Drizzle)
* **Live updates**: CMS edits propagate to the UI in real time (HMR-like behavior)

This approach replaces traditional per-namespace JSON files with a **domain-based key hierarchy**, while still remaining fully compatible with i18next’s mental model.

---

## Terminology

### Namespace (i18next concept)

* A **technical loading unit** for i18next
* We use **exactly one namespace**:

  ```ts
  namespace = "translations"
  ```

### Domain (project concept)

* A **semantic ownership prefix**
* Indicates **where a key originates**
* Mirrors database tables

Domains are implemented as the **first key segment**, not as namespaces.

---

## Database Structure

Each domain has its own table:

| Domain  | Table name           |
| ------- | -------------------- |
| `ui`    | `translations_ui`    |
| `app`   | `translations_app`   |
| `admin` | `translations_admin` |

Each table stores:

* `key` (dot-separated, domain-prefixed)
* `translations` (JSON per locale)
* `is_active`
* timestamps

### Example DB keys

**Important**: Database keys have different formats per domain:

```text
# translations_ui table: keys stored WITHOUT "ui." prefix
buttons.save
tables.headers.name
time.units.seconds

# translations_app table: keys stored WITH "app." prefix
app.pages.main.title
app.components.orderStatus.ready

# translations_admin table: keys stored WITH "admin." prefix
admin.pages.dashboard.title
admin.pages.languages.description
```

**Why the difference?**
* `translations_ui` was migrated from legacy JSON files that didn't have domain prefixes
* `translations_app` and `translations_admin` were created with domain prefixes from the start
* Server-side transformation handles this difference automatically

---

## i18next Key Usage (Frontend)

All keys are resolved from the **single `translations` namespace**, but are **domain-prefixed** for clarity and safety.

```ts
const { t } = useTranslation();

t('ui.buttons.save');
t('app.pages.title');
t('admin.pages.description');
```

### Why this is intentional

✅ Prevents collisions
✅ Documents ownership at usage site
✅ Matches DB structure exactly
✅ Makes CMS tooling trivial
✅ Safe migrations and refactors

---

## API Design

### 1. Initial i18next bootstrap (ALL domains)

Used by `i18n.config.ts`:

```http
GET /api/i18n/translations?lng=es-ES
```

**Response shape:**

```json
{
  "ui": { ... },
  "app": { ... },
  "admin": { ... }
}
```

This single response is registered under the `translations` namespace.

---

### 2. Domain-specific fetch (CMS, admin UI)

Used by the translation CMS/editor:

```http
GET /api/i18n/translations/:domain?lng=es-ES
```

Examples:

```http
/api/i18n/translations/ui
/api/i18n/translations/app
/api/i18n/translations/admin
```

**Response format**: Array of translation objects (for CMS editing)

```json
[
  {
    "id": "cmj8oqn8z0000bclw3t5iz741",
    "key": "buttons.save",
    "translations": {
      "es-ES": "Guardar",
      "en-GB": "Save",
      "ca-ES": "Desar"
    },
    "isActive": true
  }
]
```

This allows:

* Editing a single domain
* Avoiding overfetching
* Clear CMS grouping
* Keys returned as stored (with domain prefix for app/admin, without for ui)

### 3. CRUD operations (CMS mutations)

Used for creating, updating, and deleting translations:

```http
POST   /api/translations/:namespace
PATCH  /api/translations/:namespace/:id
DELETE /api/translations/:namespace/:id
```

Where `:namespace` ∈ `['ui', 'app', 'admin']` (maps to database table).

**Note**: These endpoints are separate from i18n endpoints and use the table name as the namespace parameter.

---

## Server-Side Implementation

### Key Transformation Logic

The server transforms database keys differently based on domain:

**For `translations_ui`**:
* DB stores: `buttons.save`
* Server adds prefix: `ui.buttons.save`
* Result: `{ ui: { buttons: { save: "Save" } } }`

**For `translations_app`**:
* DB stores: `app.pages.title`
* Server skips first segment: `pages.title`
* Result: `{ app: { pages: { title: "Title" } } }`

**For `translations_admin`**:
* DB stores: `admin.pages.dashboard`
* Server skips first segment: `pages.dashboard`
* Result: `{ admin: { pages: { dashboard: "Dashboard" } } }`

This transformation happens in `buildDomainGroupedResources()` during bulk load.

### Handler Flow

1. **Bulk load** (`GET /api/i18n/translations`):
   * Queries all three tables in parallel
   * Transforms keys per domain rules
   * Returns domain-grouped nested object
   * Registered as single `translations` namespace in i18next

2. **Domain-specific** (`GET /api/i18n/translations/:domain`):
   * Queries single table based on domain
   * Returns raw array format (no transformation)
   * Used by CMS for editing

---

## i18next Configuration

```ts
i18n.init({
  ns: ['translations'],
  defaultNS: 'translations',

  backend: {
    loadPath: '/api/i18n/translations?lng={{lng}}',
  },

  supportedLngs: ['es-ES', 'en-GB', 'ca-ES'],
  fallbackLng: 'es-ES',

  interpolation: {
    escapeValue: false,
  },
});
```

> ⚠️ Domains are **NOT namespaces**.
> They live **inside** the `translations` namespace as key prefixes.

---

## Folder Structure (Current & Planned)

### Current

```
packages/
  i18n/
    src/
      types/
      utils/
      scripts/
```

### Planned (DB → FS backups)

```
packages/
  i18n/
    translations/
      es-ES/
        translations.json
      en-GB/
        translations.json
      ca-ES/
        translations.json
    src/
      types/
      utils/
      scripts/
```

The `translations/` folder becomes:

* A **backup**
* A **diffable artifact**
* A **type source**
* A **migration / seed source**

---

## CMS Integration

### Live Updates (HMR-like behavior)

When translations are saved via CMS:

1. **Mutation** updates database via `/api/translations/:namespace`
2. **Query invalidation** refreshes React Query cache
3. **i18next reload** triggers `i18n.reloadResources(language, 'translations')`
4. **UI updates** immediately without page refresh

```ts
// After save mutation
await queryClient.invalidateQueries({ queryKey: [`translations-${namespace}`] });
await i18n.reloadResources(i18n.language, 'translations');
```

### CMS Component Structure

* **`TranslationsPage`**: Main page component, accepts `namespace` and `groups` props
* **`useUiTranslationData`**: Fetches domain-specific translations for editing
* **`useSaveUiTranslations`**: Handles create/update mutations
* **`useDeleteUiTranslation`**: Handles delete mutations

### Domain-Specific Routes

```tsx
// Three routes using same component with different props
<TranslationsPage namespace="ui" groups={['buttons', 'tables', 'time']} />
<TranslationsPage namespace="app" groups={['pages', 'components', 'orders']} />
<TranslationsPage namespace="admin" groups={['pages', 'filterAnalysis', 'languages', ...]} />
```

---

## Design Principles

* **One namespace**
* **Many domains**
* **DB is source of truth**
* **Filesystem is backup + tooling**
* **Keys never lie about ownership**
* **Live updates without page refresh**
* **Domain grouping for clear ownership**

---

## Data Flow

### Initial Load (App Bootstrap)

```
1. i18next.init() → HttpBackend
2. GET /api/i18n/translations?lng=es-ES
3. Server queries: translations_ui, translations_app, translations_admin
4. Server transforms: { ui: {...}, app: {...}, admin: {...} }
5. i18next registers as 'translations' namespace
6. Frontend uses: t('ui.buttons.save')
```

### CMS Edit Flow

```
1. User edits translation in CMS
2. POST/PATCH /api/translations/:namespace
3. Database updated
4. React Query cache invalidated
5. i18n.reloadResources('translations')
6. UI updates immediately
```

### CMS Fetch Flow

```
1. CMS component mounts
2. GET /api/i18n/translations/:domain
3. Server returns array format
4. CMS displays/edits translations
5. Save triggers mutation + reload
```

---

## Summary

* **Namespace**: `translations` (single namespace)
* **Domains**: `ui`, `app`, `admin` (key prefixes, not namespaces)
* **Storage**: SQLite tables per domain
* **Loading**: Bulk load for i18next, domain-specific for CMS
* **Updates**: Live reload without page refresh
* **Key format**: Domain-prefixed in usage, stored format varies by domain
* **Clean DX**: Type-safe, scalable, CMS-friendly

---
