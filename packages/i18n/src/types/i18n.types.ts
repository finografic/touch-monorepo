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
  languages: LanguageConfig[];
  typeGeneration: TypeGenerationConfig;
  validation?: {
    /** Whether to strictly validate language codes */
    strict?: boolean;
    /** Additional allowed language codes */
    additionalCodes?: string[];
  };
}

export interface I18nDateFormat {
  short: string;
  long: string;
  time: string;
  dateTime: string;
}

export interface I18nNumberFormat {
  decimal: string;
  thousands: string;
  currency: string;
}
