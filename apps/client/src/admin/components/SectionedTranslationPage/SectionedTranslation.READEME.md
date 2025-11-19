## Summary

### 1. Added toast notifications

- Updated `useUiSectionForm` to show toast notifications on save success/error
- Toast is optional (can be disabled with `showToast={false}`)
- Success toasts show the section name and file count
- Error toasts show the error message with retry context

### 2. Created reusable `SectionedTranslationPage` component

- Location: `apps/client/src/admin/components/SectionedTranslationPage/`
- Handles the common pattern:
  - Wraps content in `AdminPageLayout`
  - Maps over sections and renders each as a form
  - Handles translation key resolution
  - Supports custom styles
- Flexible design:
  - Generic types for items and languages
  - Generic handler signature (supports different `onItemChange` signatures)
  - Render prop pattern for maximum flexibility
  - Business logic stays in custom hooks

### 3. Updated both pages to use the new component

- `TranslationsUiPage` — now uses `SectionedTranslationPage`
- `TranslationsProductPage` — now uses `SectionedTranslationPage`
- Both pages are cleaner and follow the same pattern
- Business logic remains in their respective hooks

### Benefits

- DRY: common pattern extracted to one place
- Maintainable: design changes happen in one component
- Flexible: supports different data structures and handler signatures
- Consistent: all translation pages follow the same pattern
- Toast integration: automatic notifications for save actions

### How to add more translation pages

1. Create a custom hook (like `useUiLabelSections` or `useProductTranslationSections`)
2. Create a section form component (like `UiLabelSection` or `ProductTranslationSectionForm`)
3. Use `SectionedTranslationPage` with a render prop:

```tsx
<SectionedTranslationPage
  subtitle="Your Page Title"
  sections={sections}
  supportedLanguages={supportedLanguages}
  isLoading={isLoading}
  handleValueChange={handleValueChange}
  resetSection={resetSection}
  saveSection={saveSection}
  isSectionDirty={isSectionDirty}
  renderSection={(props) => <YourSectionComponent {...props} />}
  styles={styles}
/>
```
