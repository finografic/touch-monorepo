# RHF-Based Translation Table

This directory contains a React Hook Form-based translation table that replaces the previous PrimeReact DataTable implementation.

## Architecture

The table uses `react-hook-form` with `useFieldArray` for powerful form state management, eliminating the constraints of PrimeReact's editable rows while maintaining similar UI/UX.

### Key Files

1. **`useTranslationsTableForm.ts`** - Core form logic hook
   - Manages form state with RHF
   - Handles field array operations (add/remove rows)
   - Auto-generates slugified `name` from language fields (debounced)
   - Converts between legacy format (`name_es_es`) and RHF format (`esEs`)
   - Filters blank rows on submit

2. **`ProductTranslationsTable.tsx`** - Table container component
   - Renders the table structure and headers
   - Provides Cancel/Save/Add buttons
   - Integrates with parent's save callback

3. **`TranslationsRow.tsx`** - Individual row component
   - Uses RHF `Controller` for each field
   - Shows orange/warning color for dirty fields
   - Readonly `name` field with auto-slug generation
   - Editable language fields (`esEs`, `enGb`, `caEs`)

4. **`translation-converters.ts`** - Format conversion utilities
   - `convertLegacyToRHFFormat()` - Converts parent's legacy fields to RHF format
   - `convertRHFToLegacyFormat()` - Converts RHF format back to legacy for saving

## Data Flow

```
Parent (useProductTranslationSections)
  ↓ (provides items with name_es_es, name_en_gb, name_ca_es)
useTranslationsTableForm
  ↓ (converts to esEs, enGb, caEs)
RHF FormProvider
  ↓
TranslationsRow (renders inputs)
  ↑ (user edits)
useTranslationsTableForm
  ↓ (on save: converts back to name_es_es format)
Parent's handleRHFSave
  ↓ (updates section state)
saveSection (persists to backend)
```

## Features

- ✅ Auto-slugification of `name` field from language inputs (debounced 350ms)
- ✅ Priority: `esEs` > `enGb` > `caEs` for slug generation
- ✅ Orange/warning color for dirty fields
- ✅ Orange `-` placeholder for empty fields
- ✅ Automatic blank row removal on save
- ✅ Full RHF benefits: `isDirty`, `dirtyFields`, `reset`, etc.
- ✅ Seamless integration with existing backend API calls

## Usage

```tsx
<ProductTranslationsTable
  sectionKey="drinkTypes"
  items={section.items} // Legacy format from parent
  onSave={async ({ sectionKey, items }) => {
    await handleRHFSave(sectionKey, items); // Also legacy format
  }}
/>
```

## Why RHF?

The previous PrimeReact DataTable implementation was powerful but had constraints:
- Limited control over form state
- Custom dirty tracking needed
- Complex validation integration
- Less flexible styling for individual fields

RHF provides:
- Built-in form state (`isDirty`, `dirtyFields`, `errors`)
- Easy validation with `yup`/`zod`
- Granular field control
- Better performance with field-level subscriptions
- More maintainable code with standard React patterns

