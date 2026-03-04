# Imported Styles Analysis

Named imports from `'styles'` in `apps/client/**/*.styles.ts` files (excluding commented imports).

| done | Imported Object | Count |
|------|-----------------|-------|
| ✅   | colors          | 95    |
| ✅   | layout          | 36    |
| [ ]  | button          | 11    |
| [ ]  | spacing         | 10    |
| ✅   | min             | 8     |

File paths for the lower-count imports:

---

**border** (3 files)

- [ ] `./src/apps/client/src/forms/SelectSearchable/SelectSearchable.styles.ts`
- [ ]  `./src/apps/client/src/forms/InputTime/InputTime.styles.ts`
- [ ]  `./src/apps/client/src/admin/pages/AdminRelaysPage/RelaysTable/RelaysTable.styles.ts`

**typography** (2 files)

- [ ]  `./src/apps/client/src/layout/Layout.styles.ts`
- [ ]  `./src/apps/client/src/pages/LoginPage/LoginPage.styles.ts`

**BREAKPOINTS** (2 files)

- [x]  `./src/apps/client/src/admin/components/AdminNavigation/AdminNavWrapper.styles.ts`
- [x]  `./src/apps/client/src/layout/AdminLayout.styles.ts`

**fontWeights** (1 file)

- [ ]  `./src/apps/client/src/pages/LoginPage/LoginPage.styles.ts`

**fontSizes** (1 file)

- [ ]  `./src/apps/client/src/pages/LoginPage/LoginPage.styles.ts`

**fontFamilies** (1 file)

- [ ]  `./src/apps/client/src/admin/pages/Translations/shared/styles/TranslationsTable.styles.ts`

---

**Summary:** 8 unique files. `LoginPage.styles.ts` imports typography, fontSizes, and fontWeights.
