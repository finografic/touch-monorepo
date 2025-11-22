/**
 * I18n Configuration Types
 * Defines the structure for configuring the i18n system
 *
 * This file reuses types from @workspace/i18n/types where possible,
 * and adds config-specific utility types (RegionLocale, LanguageConfigMap, etc.)
 */

// Re-export types from the main types package
export type { LanguageConfig, LanguageInfo } from '../types/language.types';
export type { TypeGenerationConfig } from '../types/type-generation.types';
export type { I18nConfig } from '../types/i18n.types';

// Import for use in this file
import type { LanguageConfig } from '../types/language.types';

// Config-specific utility types (used by constants and config system)
export type LangCode2 = string;
export type CountryCode = string;
export type RegionLocale = `${LangCode2}-${CountryCode}`;

/**
 * Language configuration mapping interface
 * Maps region locales (e.g., "es-ES") to language configurations
 */
export type LanguageConfigMap = Record<RegionLocale, LanguageConfig>;
