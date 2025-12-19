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

```text
ui.buttons.save
ui.tables.headers.name

app.pages.main.title
app.components.orderStatus.ready

admin.pages.dashboard.title
admin.pages.languages.description
```

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

This allows:

* Editing a single domain
* Avoiding overfetching
* Clear CMS grouping

---

## i18next Configuration (Conceptual)

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

## Design Principles

* **One namespace**
* **Many domains**
* **DB is source of truth**
* **Filesystem is backup + tooling**
* **Keys never lie about ownership**

---

## Summary

* Namespace: `translations`
* Domains: `ui`, `app`, `admin`
* Domains are **key prefixes**, not namespaces
* i18next loads once, CMS loads selectively
* Clean DX, scalable, CMS-friendly

---
