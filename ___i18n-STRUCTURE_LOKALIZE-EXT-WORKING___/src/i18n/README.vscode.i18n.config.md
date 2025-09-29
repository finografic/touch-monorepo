# ✅ VSCode / Cursor - Lokalize i18n EXTENSION settings

```json
{
  "i18n-ally.annotations": true,
  "i18n-ally.encoding": "utf-8",
  "i18n-ally.extract.keyMaxLength": 120,
  "i18n-ally.sortKeys": false,
  "i18n-ally.tabStyle": "space",
  "i18n-ally.indent": 2,
  "i18n-ally.fullReloadOnChanged": true,
  "i18n-ally.dirStructure": "auto",
  // "i18n-ally.annotationDelimiter": " - ",
  "i18n-ally.annotationDelimiter": ": ",
  "i18n-ally.keystyle": "nested",
  "i18n-ally.regex.usageMatchAppend": [
    "(?<=\\Wt\\(['\"])(?<key>[a-zA-Z0-9 .-]+?)(?=['\"]\\))",
    "(?<=\\Wt<string>\\(['\"])(?<key>[a-zA-Z0-9 .-]+?)(?=['\"]\\))"
  ],
  "i18n-ally.enabledFrameworks": [
    "react",
    "i18next",
    "react-i18next"
  ],
  "i18n-ally.annotationInPlace": false,
  "i18n-ally.theme.annotation": "#37A",
  "i18n-ally.theme.annotationBorder": "rgba(36, 139, 131, .2)",
  "i18n-ally.theme.annotationMissing": "#d37070",
  "i18n-ally.theme.annotationMissingBorder": "#d37070",
  "i18n-ally.sourceLanguage": "en",
  "i18n-ally.displayLanguage": "en",
  // "i18n-ally.pathMatcher": "translations/{locale}.json", // //TODO: DON'T SET !! ?? ❌ IMPORTANT: value must start with "translations/{locale}.json" -- NOT "src/i18n/..." !!!!!
  "i18n-ally.localesPaths": [
    "src/i18n/translations",
    // "apps/client/src/i18n/translations",
    "packages/i18n/src/translations"
  ],
}

```
