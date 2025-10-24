/**
 * @workspace/i18n
 *
 * Internationalization package providing:
 * - Configuration and type generation
 * - Language mappings and validation
 * - i18n utilities
 *
 * NOTE: This entry point is browser-safe and does not export Node.js generators
 * For Node.js generators, import from '@workspace/i18n/generators'
 */

export * from './config';
export * from './translations';

// DO NOT export generators here - they contain Node.js-only code (fs, path)
// Use '@workspace/i18n/generators' for Node.js environments
