# MetadataProvider

Root-mounted Zustand context (see `PaginationProvider` / zustand-context-creator pattern).

- **`title`** — Page title key or string for document title sync (`usePageTitleKey` / `useDocumentTitleSync`).
- **`selectedSlots`** / **`toggleSlot`** / **`setSelectedSlots`** — Main grid slot selection; lives here so it survives when `LayoutUiProvider` unmounts (e.g. navigating to Admin).

Use **`useMetadata()`** in consumers. **`useLayoutUi()`** merges the slot slice for backward compatibility (`toggleMainPageSlot` aliases `toggleSlot`).
