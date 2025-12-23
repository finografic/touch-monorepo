# TODO — I18N Table Pages Alignment

Scope: `TranslationsPage` (ui/app/admin) and `TranslationsProductPage` (products).

## Quick wins

- Extract a shared `sortSections(sections, order)` helper and shared `TABS_SORT_ORDER` maps (per domain / per product) to avoid inline sorting logic.
- Share tab rendering helper (Triggers + Content) so both pages use the same structure and fallback handling for missing tabs.
- Lift common table props (loading flags, mutation handlers, invalidate helpers) into a shared hook to reduce duplication.
- Add shared type guards for section keys/group keys to keep tab ordering strongly typed.

## Medium

- Unify translation label lookup for tabs: both pages should use the same i18n key helper rather than hardcoded strings.
- Extract shared table row behaviors (slug/key regeneration, dirty state styling) where possible; keep page-specific divider rows separate.
- Centralize invalidate logic (e.g., `invalidateReferenceDataQueries`) into a reusable utility used by both pages’ save/delete flows.

## Long term

- Create a small shared “translations page shell” component that accepts `sections`, `renderTable`, and `tabOrder` props; reuse for both pages to align layout, loading, and empty states.
- Consolidate DTO/transform helpers for translations payloads so both pages serialize/deserialize items the same way.
