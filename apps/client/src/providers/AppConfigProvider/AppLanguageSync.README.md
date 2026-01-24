# Dynamic i18n Languages — Design & Invariants

This project supports **dynamically added languages** (via Admin UI + DB) using **i18next + react-i18next**.

This file documents the **critical architectural constraints** and **why the system is implemented the way it is**.

---

## TL;DR (Read This First)

> **Supported languages are *bootstrap configuration*, not runtime state.**

i18next **locks its language whitelist at initialization time**.
Languages added *after* `i18n.init()` **cannot be fully activated**, even if their translations are loaded later.

To support dynamic languages safely:

* **Runtime React code persists supported languages**
* **Bootstrap i18n config reads them once at startup**
* Runtime only handles *resource loading* and *language switching*

---

## Problem This Solves

The system allows:

* Adding a **new supported language** at runtime (e.g. `pt-BR`)
* Auto-populating translations via Google Translate
* Editing translations in Admin CMS
* Switching languages without a page reload

### The failure mode we hit

When a language is added dynamically:

* DB contains correct translations
* API returns correct data
* `i18n.loadLanguages('pt-BR')` runs
* `languageChanged('pt-BR')` fires
* **UI still falls back to default language (`es-ES`)**

This happens **silently**, with no errors.

---

## Root Cause (Critical i18next Invariant)

i18next has **two distinct phases**:

### 1. Initialization Phase (non-reactive)

Executed in `i18n.config.ts`:

* `supportedLngs`
* fallback rules
* language resolution logic

> ⚠️ Languages NOT present here are considered *unsupported forever*.

Updating `i18n.options.supportedLngs` **after init does NOT fix this**.

---

### 2. Runtime Phase (reactive)

Executed after React mounts:

* loading translation resources
* calling `changeLanguage`
* reloading translations

This phase **cannot override init-time language assumptions**.

---

## Why Hard-Coding “Worked”

```ts
DEFAULT_SUPPORTED_LANGUAGES = [
  'es-ES',
  'en-GB',
  'ca-ES',
  'pt-BR'
];
```

Because:

* `pt-BR` existed **before** `i18n.init()`
* i18next trusted it as a valid language
* backend loading worked normally

This confirmed that:

* translations were correct
* API was correct
* UI was correct

The failure was **bootstrap timing**, not loading.

---

## The Correct Architecture

### Key Rule

> **Runtime code may PREPARE the next boot, but must not rewrite the current one.**

---

### How This Project Implements That

#### 1. Runtime (React) — AppLanguageSync

* Fetch supported languages from DB
* Update AppConfig context
* **Persist language list to localStorage**

This is *preparation*, not activation.

---

#### 2. Bootstrap (i18n.config.ts)

At startup:

* Read supported languages from localStorage
* Fall back to defaults if missing
* Initialize i18next with the full list

This satisfies i18next’s init-time invariant.

---

#### 3. Runtime Language Switching

After init:

* `changeLanguage(lng)` works
* `reloadResources(lng)` works
* No fallback
* No re-init
* No hacks

---

## Why Local Storage Is Used

Local / session storage is **intentional**, not a workaround.

It provides:

* synchronous availability at bootstrap
* deterministic startup behavior
* zero React dependency
* persistence across reloads

Languages behave like:

* feature flags
* theme preferences
* capability toggles

Not like reactive UI state.

---

## What NOT To Do (Important)

❌ Do NOT rely on:

* `i18n.options.supportedLngs = [...]` at runtime
* `loadLanguages()` alone
* reinitializing i18next
* namespace heuristics
* forcing `changeLanguage` retries

These approaches appear to work in logs but **still fall back silently**.

---

## Final Mental Model (Memorize This)

> **Languages are a capability, not just data.**
> Capabilities must exist at bootstrap.

Translations are data.
Supported languages are configuration.

---

## If You Ever See This Bug Again

Symptoms:

* Logs say “language applied”
* Resources appear loaded
* UI still shows default language

Checklist:

1. Is the language present in `supportedLngs` at `i18n.init()`?
2. If not → it will NEVER render correctly
3. Persist it and reboot

---

## Status

✔ Dynamic language addition supported
✔ No re-initialization
✔ No race conditions
✔ Admin-driven
✔ Architecture-aligned
