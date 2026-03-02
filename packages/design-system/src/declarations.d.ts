// Ambient declarations for the design-system package

declare module 'eslint-plugin-markdownlint' {
  import type { Linter } from 'eslint';
  const plugin: Linter.Plugin;
  export default plugin;
}

declare module 'eslint-plugin-markdownlint/parser.js' {
  import type { Linter } from 'eslint';
  const parser: Linter.Parser;
  export default parser;
}

// CSS file imports (for library consumers)
declare module '*.css';
