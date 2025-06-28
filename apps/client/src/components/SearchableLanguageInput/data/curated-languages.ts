/**
 * Curated Language Selection System
 *
 * A controlled set of language/locale combinations that provides:
 * - One primary option per major language
 * - Strategic regional variants for major markets
 * - No confusing duplicates or obscure territories
 *
 * Based on analysis of production apps and real-world usage patterns.
 */

export interface CuratedLanguage {
  /** ISO 639-1 + ISO 3166-1 locale code (e.g., 'fr-FR') */
  code: string;
  /** English display name */
  name: string;
  /** Native language name */
  nativeName: string;
  /** Country/region name */
  region: string;
  /** ISO 3166-1 alpha-2 country code for flag */
  countryCode: string;
  /** Priority for sorting (lower = higher priority) */
  priority: number;
  /** Whether this is the primary/default variant for this language */
  isPrimary: boolean;
}

/**
 * Curated language list - carefully selected for real-world usage
 *
 * Selection criteria:
 * - Major global languages with significant speaker populations
 * - Important regional variants for business/localization
 * - One primary variant per language family
 * - Strategic coverage without overwhelming choice
 */
export const CURATED_LANGUAGES: CuratedLanguage[] = [
  // === TIER 1: Global Languages (Top Priority) ===
  {
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
    region: 'United States',
    countryCode: 'US',
    priority: 1,
    isPrimary: true,
  },
  {
    code: 'en-GB',
    name: 'English',
    nativeName: 'English',
    region: 'United Kingdom',
    countryCode: 'GB',
    priority: 2,
    isPrimary: false,
  },
  {
    code: 'en-AU',
    name: 'English',
    nativeName: 'English',
    region: 'Australia',
    countryCode: 'AU',
    priority: 3,
    isPrimary: false,
  },

  {
    code: 'zh-CN',
    name: 'Chinese',
    nativeName: '中文',
    region: 'China',
    countryCode: 'CN',
    priority: 4,
    isPrimary: true,
  },
  {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    region: 'Spain',
    countryCode: 'ES',
    priority: 5,
    isPrimary: true,
  },
  {
    code: 'es-MX',
    name: 'Spanish',
    nativeName: 'Español',
    region: 'Mexico',
    countryCode: 'MX',
    priority: 6,
    isPrimary: false,
  },

  {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    region: 'France',
    countryCode: 'FR',
    priority: 7,
    isPrimary: true,
  },
  {
    code: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    region: 'Germany',
    countryCode: 'DE',
    priority: 8,
    isPrimary: true,
  },
  {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    region: 'Japan',
    countryCode: 'JP',
    priority: 9,
    isPrimary: true,
  },

  // === TIER 2: Major Regional Languages ===
  {
    code: 'pt-BR',
    name: 'Portuguese',
    nativeName: 'Português',
    region: 'Brazil',
    countryCode: 'BR',
    priority: 10,
    isPrimary: true,
  },
  {
    code: 'ru-RU',
    name: 'Russian',
    nativeName: 'Русский',
    region: 'Russia',
    countryCode: 'RU',
    priority: 11,
    isPrimary: true,
  },
  {
    code: 'it-IT',
    name: 'Italian',
    nativeName: 'Italiano',
    region: 'Italy',
    countryCode: 'IT',
    priority: 12,
    isPrimary: true,
  },
  {
    code: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    region: 'South Korea',
    countryCode: 'KR',
    priority: 13,
    isPrimary: true,
  },
  {
    code: 'nl-NL',
    name: 'Dutch',
    nativeName: 'Nederlands',
    region: 'Netherlands',
    countryCode: 'NL',
    priority: 14,
    isPrimary: true,
  },

  // === TIER 3: Important Business Languages ===
  {
    code: 'ar-SA',
    name: 'Arabic',
    nativeName: 'العربية',
    region: 'Saudi Arabia',
    countryCode: 'SA',
    priority: 15,
    isPrimary: true,
  },
  {
    code: 'tr-TR',
    name: 'Turkish',
    nativeName: 'Türkçe',
    region: 'Turkey',
    countryCode: 'TR',
    priority: 16,
    isPrimary: true,
  },
  {
    code: 'pl-PL',
    name: 'Polish',
    nativeName: 'Polski',
    region: 'Poland',
    countryCode: 'PL',
    priority: 17,
    isPrimary: true,
  },
  {
    code: 'sv-SE',
    name: 'Swedish',
    nativeName: 'Svenska',
    region: 'Sweden',
    countryCode: 'SE',
    priority: 18,
    isPrimary: true,
  },
  {
    code: 'fi-FI',
    name: 'Finnish',
    nativeName: 'Suomi',
    region: 'Finland',
    countryCode: 'FI',
    priority: 19,
    isPrimary: true,
  },
  {
    code: 'th-TH',
    name: 'Thai',
    nativeName: 'ไทย',
    region: 'Thailand',
    countryCode: 'TH',
    priority: 20,
    isPrimary: true,
  },

  // === TIER 4: Emerging Markets & Regional Importance ===
  {
    code: 'vi-VN',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    region: 'Vietnam',
    countryCode: 'VN',
    priority: 21,
    isPrimary: true,
  },
  {
    code: 'id-ID',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    region: 'Indonesia',
    countryCode: 'ID',
    priority: 22,
    isPrimary: true,
  },
  {
    code: 'he-IL',
    name: 'Hebrew',
    nativeName: 'עברית',
    region: 'Israel',
    countryCode: 'IL',
    priority: 23,
    isPrimary: true,
  },
  {
    code: 'cs-CZ',
    name: 'Czech',
    nativeName: 'Čeština',
    region: 'Czech Republic',
    countryCode: 'CZ',
    priority: 24,
    isPrimary: true,
  },
  {
    code: 'hu-HU',
    name: 'Hungarian',
    nativeName: 'Magyar',
    region: 'Hungary',
    countryCode: 'HU',
    priority: 25,
    isPrimary: true,
  },

  // === TIER 5: Additional European & Regional Languages ===
  {
    code: 'ro-RO',
    name: 'Romanian',
    nativeName: 'Română',
    region: 'Romania',
    countryCode: 'RO',
    priority: 26,
    isPrimary: true,
  },
  {
    code: 'bg-BG',
    name: 'Bulgarian',
    nativeName: 'Български',
    region: 'Bulgaria',
    countryCode: 'BG',
    priority: 27,
    isPrimary: true,
  },
  {
    code: 'el-GR',
    name: 'Greek',
    nativeName: 'Ελληνικά',
    region: 'Greece',
    countryCode: 'GR',
    priority: 28,
    isPrimary: true,
  },
  {
    code: 'sl-SI',
    name: 'Slovenian',
    nativeName: 'Slovenščina',
    region: 'Slovenia',
    countryCode: 'SI',
    priority: 29,
    isPrimary: true,
  },
  {
    code: 'lv-LV',
    name: 'Latvian',
    nativeName: 'Latviešu',
    region: 'Latvia',
    countryCode: 'LV',
    priority: 30,
    isPrimary: true,
  },
  {
    code: 'et-EE',
    name: 'Estonian',
    nativeName: 'Eesti',
    region: 'Estonia',
    countryCode: 'EE',
    priority: 31,
    isPrimary: true,
  },

  // === TIER 6: South Asian & Specialized Languages ===
  {
    code: 'bn-BD',
    name: 'Bengali',
    nativeName: 'বাংলা',
    region: 'Bangladesh',
    countryCode: 'BD',
    priority: 32,
    isPrimary: true,
  },
  {
    code: 'gu-IN',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    region: 'India',
    countryCode: 'IN',
    priority: 33,
    isPrimary: true,
  },
  {
    code: 'ta-LK',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    region: 'Sri Lanka',
    countryCode: 'LK',
    priority: 34,
    isPrimary: true,
  },
  {
    code: 'ur-IN',
    name: 'Urdu',
    nativeName: 'اردو',
    region: 'India',
    countryCode: 'IN',
    priority: 35,
    isPrimary: true,
  },
  {
    code: 'fa-IR',
    name: 'Persian',
    nativeName: 'فارسی',
    region: 'Iran',
    countryCode: 'IR',
    priority: 36,
    isPrimary: true,
  },
  {
    code: 'ne-NP',
    name: 'Nepali',
    nativeName: 'नेपाली',
    region: 'Nepal',
    countryCode: 'NP',
    priority: 37,
    isPrimary: true,
  },

  // === TIER 7: Regional European Languages ===
  {
    code: 'gl-ES',
    name: 'Galician',
    nativeName: 'Galego',
    region: 'Spain',
    countryCode: 'ES',
    priority: 38,
    isPrimary: true,
  },
  {
    code: 'eu-EU',
    name: 'Basque',
    nativeName: 'Euskera',
    region: 'Basque Country',
    countryCode: 'ES',
    priority: 39,
    isPrimary: true,
  },
  {
    code: 'oc-OC',
    name: 'Occitan',
    nativeName: 'Occitan',
    region: 'Occitania',
    countryCode: 'FR',
    priority: 40,
    isPrimary: true,
  },
];

/**
 * Get languages sorted by priority (most important first)
 */
export function getCuratedLanguagesSorted(): CuratedLanguage[] {
  return [...CURATED_LANGUAGES].sort((a, b) => a.priority - b.priority);
}

/**
 * Get only primary language variants (one per language family)
 */
export function getPrimaryLanguagesOnly(): CuratedLanguage[] {
  return CURATED_LANGUAGES.filter((lang) => lang.isPrimary);
}

/**
 * Get languages by tier/priority range
 */
export function getLanguagesByTier(minPriority: number, maxPriority: number): CuratedLanguage[] {
  return CURATED_LANGUAGES.filter(
    (lang) => lang.priority >= minPriority && lang.priority <= maxPriority,
  ).sort((a, b) => a.priority - b.priority);
}

/**
 * Find language by code
 */
export function findLanguageByCode(code: string): CuratedLanguage | undefined {
  return CURATED_LANGUAGES.find((lang) => lang.code.toLowerCase() === code.toLowerCase());
}

/**
 * Get language codes only (for quick lookups)
 */
export function getCuratedLanguageCodes(): string[] {
  return CURATED_LANGUAGES.map((lang) => lang.code);
}

/**
 * Convert to the format expected by SearchableLanguageInput
 */
export interface LanguageOption {
  languageCode: string;
  languageName: string;
  countryName: string;
  countryCode: string;
  flagUrl: string;
  nativeName?: string;
  emoji?: string;
}

/**
 * Convert curated languages to SearchableLanguageInput format
 */
export function convertToLanguageOptions(
  getFlagUrl: (countryCode: string) => string,
  getEmoji: (countryCode: string) => string = () => '',
): LanguageOption[] {
  return getCuratedLanguagesSorted()
    .map((lang) => ({
      languageCode: lang.code,
      languageName: lang.name,
      countryName: lang.region,
      countryCode: lang.countryCode,
      flagUrl: getFlagUrl(lang.countryCode),
      nativeName: lang.nativeName,
      emoji: getEmoji(lang.countryCode),
    }))
    .sort((a, b) => a.languageName.localeCompare(b.languageName));
}
