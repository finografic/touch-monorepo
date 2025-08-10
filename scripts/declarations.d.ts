import type { ESLint, Linter } from 'eslint';

// Plugin type that matches ESLint's expectations
type Plugin = {
  rules?: Record<string, unknown>;
  configs?: Record<string, unknown>;
};

// Type for ESLint flat config
export interface FlatConfigItem {
  files?: string[];
  ignores?: string[];
  languageOptions?: {
    parserOptions?: {
      ecmaVersion?: 'latest' | number;
      sourceType?: 'module' | 'script';
      ecmaFeatures?: {
        jsx?: boolean;
        [key: string]: unknown;
      };
      project?: string | string[] | null;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  plugins?: Record<string, Plugin>;
  processor?: string | { [k: string]: unknown };
  rules?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  [key: string]: unknown;
}

declare module '*.mjs' {
  const config: FlatConfigItem | FlatConfigItem[];
  export default config;
}
