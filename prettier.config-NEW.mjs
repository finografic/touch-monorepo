/** @type {import("prettier").Config} */
export default {
  printWidth: 110,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  quoteProps: 'consistent',

  arrowParens: 'always',
  bracketSpacing: true,
  bracketSameLine: false,
  jsxSingleQuote: false,

  endOfLine: 'lf',
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  embeddedLanguageFormatting: 'auto',
  vueIndentScriptAndStyle: false,
  overrides: [
    {
      files: ['*.ts', '*.js', '*.mjs', '*.json'],
      options: {
        printWidth: 110,
      },
    },
  ],
};
