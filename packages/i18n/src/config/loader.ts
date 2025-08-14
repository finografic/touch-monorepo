import { readFileSync } from 'fs';
import { join } from 'path';
import type { I18nConfig } from './types';
import { DEFAULT_CONFIG } from './defaults';

/**
 * Load and merge i18n configuration
 * @param configPath - Path to external config file
 * @returns Merged configuration
 */
export function loadConfig(configPath?: string): I18nConfig {
  let externalConfig: Partial<I18nConfig> = {};

  if (configPath) {
    try {
      const configFile = readFileSync(configPath, 'utf-8');
      externalConfig = JSON.parse(configFile);
    } catch (error) {
      console.warn(`Warning: Could not load config from ${configPath}:`, error);
      console.warn('Using default configuration');
    }
  }

  // Deep merge with defaults
  return {
    ...DEFAULT_CONFIG,
    ...externalConfig,
    languages: [...(DEFAULT_CONFIG.languages || []), ...(externalConfig.languages || [])],
    typeGeneration: {
      ...(DEFAULT_CONFIG.typeGeneration || {}),
      ...(externalConfig.typeGeneration || {}),
    },
    validation: {
      ...(DEFAULT_CONFIG.validation || {}),
      ...(externalConfig.validation || {}),
    },
  } as I18nConfig;
}

/**
 * Validate i18n configuration
 * @param config - Configuration to validate
 * @throws Error if configuration is invalid
 */
export function validateConfig(config: I18nConfig): void {
  // Ensure required fields exist
  if (!config.languages?.length) {
    throw new Error('Configuration must include at least one language');
  }

  if (!config.typeGeneration?.languageMapping) {
    throw new Error('Configuration must include language mapping');
  }

  // Validate language codes
  const validIso2Pattern = /^[a-z]{2}$/;
  const validIso3Pattern = /^[a-z]{3}$/;

  config.languages.forEach((lang) => {
    if (!validIso2Pattern.test(lang.iso2)) {
      throw new Error(`Invalid ISO 639-1 code: ${lang.iso2}`);
    }
    if (!validIso3Pattern.test(lang.iso3)) {
      throw new Error(`Invalid ISO 639-2 code: ${lang.iso3}`);
    }
  });

  // Validate country codes
  const validCountryPattern = /^[A-Z]{2}$/;
  config.typeGeneration.supportedCountries.forEach((country) => {
    if (!validCountryPattern.test(country)) {
      throw new Error(`Invalid country code: ${country}`);
    }
  });

  // Validate language mapping
  Object.entries(config.typeGeneration.languageMapping).forEach(([iso3, iso2]) => {
    if (!validIso3Pattern.test(iso3)) {
      throw new Error(`Invalid ISO 639-2 code in mapping: ${iso3}`);
    }
    if (!validIso2Pattern.test(iso2)) {
      throw new Error(`Invalid ISO 639-1 code in mapping: ${iso2}`);
    }
  });
}
