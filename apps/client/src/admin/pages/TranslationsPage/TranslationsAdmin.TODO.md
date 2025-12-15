Great milestone to reach — this is actually a **very clean place** to make the switch, because your data model and CMS are already solid 👍
You’re basically asking: *how do I re-wire i18next so `t('ui.buttons.save')` resolves from the DB instead of JSON?*

Below are **realistic strategies**, from most recommended → most flexible → most advanced. I’ll also anchor them to **your exact setup** (SQLite, monorepo, CMS, existing JSON, runtime edits).

---

## Core principle (important)

i18next **does not care** where translations come from.
It only needs a **backend** that can resolve:

```ts
(language, namespace) -> resources object
```

Everything else (DB, API, cache, CMS) is *your implementation detail*.

So the question becomes:

> *Where should i18next fetch resources from, and when?*

---

# ✅ Recommended Strategy (Hybrid, Production-Safe)

### **Custom i18next backend that loads from your API (DB)**

with **fallback to JSON** for bootstrapping & resilience.

This gives you:

* Live-editable translations
* No file watching crashes
* No rebuild needed
* Works in dev & prod
* Easy cache control
* Minimal changes to your app code

---

## 1️⃣ Use a custom i18next backend (API → DB)

You already have:

* Server routes
* DB table (`translations_ui`)
* CMS
* Language switching

Perfect.

### Install helper

```bash
pnpm add i18next-http-backend
```

(or write your own backend — example below)

---

## 2️⃣ Backend contract (what i18next expects)

For namespace `ui`, language `en-GB`:

```ts
{
  "buttons": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "tables": {
    "headers": {
      "volume": "Volume"
    }
  }
}
```

Your DB rows:

```json
key: "buttons.save"
translations: { "en-GB": "Save", ... }
```

➡️ The server just needs to **expand dot-keys into nested objects**.

---

## 3️⃣ Server-side resource builder (important part)

On the server:

```ts
function buildI18nResources(rows, locale: string) {
  const result: Record<string, any> = {}

  for (const row of rows) {
    const value = row.translations[locale]
    if (!value) continue

    const parts = row.key.split('.')
    let current = result

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if (i === parts.length - 1) {
        current[part] = value
      } else {
        current[part] ??= {}
        current = current[part]
      }
    }
  }

  return result
}
```

Your API endpoint:

```http
GET /api/i18n/ui?lng=en-GB
```

Returns:

```json
{
  "buttons": { "save": "Save", ... },
  "tables": { ... }
}
```

---

## 4️⃣ Client: wire i18next to the DB backend

### Client i18n setup

```ts
import i18n from 'i18next'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: 'en-GB',
    fallbackLng: 'en-GB',

    ns: ['ui'],
    defaultNS: 'ui',

    backend: {
      loadPath: '/api/i18n/{{ns}}?lng={{lng}}',
    },

    interpolation: {
      escapeValue: false,
    },
  })
```

Now this **just works**:

```ts
t('buttons.save')
```

And updates from the CMS are visible **immediately** (on next load or refresh).

---

## 5️⃣ Handling live edits (important UX detail)

You have two good options:

### Option A — Reload namespace after save

When CMS saves:

```ts
await i18n.reloadResources(i18n.language, 'ui')
```

### Option B — Invalidate cache + reload

If you cache on the server, add:

```http
POST /api/i18n/invalidate?ns=ui
```

Then reload client-side.

---

# 🧠 Why this is better than editing JSON files

| Approach                      | Problems                                          |
| ----------------------------- | ------------------------------------------------- |
| Edit JSON files               | File watchers, rebuilds, crashes, prod impossible |
| Ship DB + JSON                | Duplication, drift                                |
| Rebuild on save               | Slow, fragile                                     |
| **API backend (recommended)** | **Clean, scalable, live, safe** ✅                 |

You already discovered these pain points — this avoids all of them.

---

# 🔁 What about i18next JSON files?

You **don’t need to delete them**.

Best practice:

* Keep JSON as **fallback / bootstrap**
* DB becomes **source of truth**

You can even preload JSON and **overwrite** with DB data.

---

# 🧩 Namespaces & tables (your design is good)

Your choice of:

```text
translations_ui
```

with keys like:

```text
buttons.save
tables.headers.volume
```

is **exactly right**.

✔ Dot-keys
✔ JSON translations column
✔ No schema changes when adding languages
✔ CMS-friendly
✔ API-friendly

Do **not** flatten further.

---

# 🚀 Advanced (optional, later)

When/if you want more:

### 🔹 Server-side cache

* Cache per `(namespace, locale)`
* Invalidate on CMS save

### 🔹 SSR hydration

* Load translations during server render
* Inject into `i18n.addResourceBundle`

### 🔹 Split namespaces

```text
ui
admin
errors
validation
```

Each maps to:

```text
translations_ui
translations_admin
```

---

# ✅ Final recommendation (TL;DR)

**Do this:**

* Keep your DB schema as-is
* Build a server endpoint that expands dot-keys
* Use `i18next-http-backend` pointing to that endpoint
* Reload namespace after CMS saves

This aligns perfectly with:

* SQLite
* Monorepo
* CMS
* Runtime edits
* Production builds

If you want, next we can:

* Add server caching
* Add optimistic updates
* Add namespace versioning
* Or map this cleanly to your existing `packages/i18n`

You’ve built the hard part already — this is the clean wiring step 🧠✨
