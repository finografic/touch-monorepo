import Hashids from 'hashids';

// Type definition for enum-like structures
export interface Enum {
  [key: string]: string | number;
  [numericIndex: number]: string;
}

// Word lists for generating readable names
const wordLists = {
  'en-GB': {
    adjectives: [
      'swift',
      'bright',
      'calm',
      'wise',
      'bold',
      'kind',
      'pure',
      'warm',
      'cool',
      'fair',
      'fresh',
      'light',
      'quick',
      'soft',
      'wild',
      'young',
      'brave',
      'free',
      'glad',
      'true',
    ],
    nouns: [
      'river',
      'star',
      'moon',
      'sun',
      'wind',
      'cloud',
      'tree',
      'bird',
      'wave',
      'lake',
      'rose',
      'rain',
      'snow',
      'leaf',
      'seed',
      'song',
      'dawn',
      'dusk',
      'peak',
      'vale',
    ],
  },
  'es-ES': {
    adjectives: [
      'veloz',
      'claro',
      'calmo',
      'sabio',
      'audaz',
      'noble',
      'puro',
      'tibio',
      'fresco',
      'bello',
      'suave',
      'leve',
      'ágil',
      'fino',
      'libre',
      'joven',
      'bravo',
      'feliz',
      'fiel',
      'real',
    ],
    nouns: [
      'río',
      'sol',
      'luna',
      'mar',
      'aire',
      'nube',
      'flor',
      'ave',
      'ola',
      'lago',
      'rosa',
      'luz',
      'nieve',
      'hoja',
      'vida',
      'alba',
      'monte',
      'valle',
      'cielo',
      'paz',
    ],
  },
} as const;

/**
 * Converts a unique ID to a numeric value that can be used as a seed
 * @param id - The unique ID to convert
 * @returns A number derived from the ID
 */
const idToNumber = (id: string): number => {
  // Take the first 8 chars of the ID and convert to a number
  const numStr = id
    .slice(0, 8)
    .split('')
    .map((c) => c.charCodeAt(0))
    .join('');

  return Number.parseInt(numStr.slice(0, 8), 10);
};

/**
 * Generates a human-readable ID using word combinations
 * @param id - The unique ID to convert
 * @param locale - The locale to use for word selection
 * @param salt - The salt to use for hashing
 * @returns A human-readable string like "swift-river-42" or "veloz-río-42"
 */
const getReadableId = (id: string, locale = 'en-GB', salt = 'default'): string => {
  const num = idToNumber(id);

  // Use English words as fallback if locale not supported
  const words = wordLists[locale as keyof typeof wordLists] || wordLists['en-GB'];

  // Use the number to deterministically select words
  const adjectiveIndex = num % words.adjectives.length;
  const nounIndex = Math.floor(num / words.adjectives.length) % words.nouns.length;

  // Take last 2 digits of the number for the suffix
  const suffix = String(num).slice(-2);

  return `${words.adjectives[adjectiveIndex]}-${words.nouns[nounIndex]}-${suffix}`;
};

/**
 * Alternative: Use hashids to generate a shorter, URL-friendly ID
 * @param id - The unique ID to convert
 * @param salt - The salt to use for hashing
 * @returns A short hash ID
 */
const getHashedId = (id: string, salt = 'default'): string => {
  const num = idToNumber(id);
  const hasher = new Hashids(salt, 6);
  return hasher.encode(num);
};

/**
 * Get both readable and hashed versions of the ID
 * @param id - The unique ID to convert
 * @param locale - The locale to use for word selection
 * @param salt - The salt to use for hashing
 * @returns Object containing both ID versions
 */
const getIdFormats = (id: string, locale = 'en-GB', salt = 'default') => ({
  readable: getReadableId(id, locale, salt),
  hashed: getHashedId(id, salt),
  original: id,
});

/**
 * Generic function to get a human readable ID for any context
 * @param id - The unique ID to convert
 * @param locale - The locale to use for word selection
 * @param salt - The salt enum value to use for hashing
 * @returns A human-readable string
 */
export const getHumanReadableId = <T>(
  id: string,
  locale = 'en-GB',
  salt: T extends string ? T : T[keyof T],
): string => {
  return getIdFormats(id, locale, String(salt)).readable;
};
