/**
 * Generated Constants for i18n
 * 🤖 AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated on 2025-10-14T21:00:36.634Z
 */

import type { RegionLocale, LangCode2, CountryCode } from './language.types';

// Supported locales for the application
export const SUPPORTED_LOCALES: readonly RegionLocale[] = [
  'en-ES' as RegionLocale,
  'en-GB' as RegionLocale,
  'en-US' as RegionLocale,
  'es-ES' as RegionLocale,
  'es-GB' as RegionLocale,
  'es-US' as RegionLocale,
  'ca-ES' as RegionLocale,
  'ca-GB' as RegionLocale,
  'ca-US' as RegionLocale,
] as const;

// Primary locale for each language
export const PRIMARY_LOCALES: Record<LangCode2, RegionLocale> = {
  'en': 'en-GB',
  'es': 'es-ES',
  'ca': 'ca-ES',
} as const;

// All available country codes
export const AVAILABLE_COUNTRIES: readonly CountryCode[] = [
  'ES',
  'GB',
  'US',
] as const;