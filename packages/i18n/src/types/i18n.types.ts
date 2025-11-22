/**
 * Main i18n configuration types
 * Combines language and type generation configs
 */

import type { LanguageConfig } from './language.types';
import type { TypeGenerationConfig } from './type-generation.types';

/**
 * Main i18n configuration interface
 */
export interface I18nConfig {
  /** Supported languages configuration */
  languages: LanguageConfig[];
  /** Type generation settings */
  typeGeneration: TypeGenerationConfig;
  /** Optional custom validation rules */
  validation?: {
    /** Whether to strictly validate language codes */
    strict?: boolean;
    /** Additional allowed language codes */
    additionalCodes?: string[];
  };
}
