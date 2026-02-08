// FULL PRETTIER SCHEMA: v3.3.2 / 2024-06-30
// http://json.schemastore.org/prettierrc
// NOTE: .mjs = ES module — use export default, NOT module.exports

/** @type {import("prettier").Config} */
export default {
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  embeddedLanguageFormatting: 'auto',
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'css',
  jsxSingleQuote: false,
  printWidth: 110,
  proseWrap: 'preserve',
  quoteProps: 'consistent',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  vueIndentScriptAndStyle: false,
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx', '*.mjs', '*.json'],
      options: {
        printWidth: 110,
      },
    },
  ],
};
