/**
 * Normalize flag codes to handle special cases
 */
const normalizeFlagCode = (flagCode: string): string => {
  const specialCases: Record<string, string> = {
    // CAT: 'es', // Catalonia -> Spain flag (REMOVED - we'll use specific Catalonia flag)
    UK: 'gb', // UK -> Great Britain
    EN: 'gb', // English -> Great Britain
  };

  return specialCases[flagCode.toUpperCase()] || flagCode;
};

/**
 * Get a fallback flag for unknown/missing codes
 */
const getFallbackFlag = (): string => {
  // Use a neutral flag or placeholder
  return 'https://flagcdn.com/w40/un.png'; // UN flag as fallback
};

/**
 * Get flag image URL from flag code
 * Uses flagcdn.com for reliable flag images, with inline SVG for special regional flags
 */
export const getFlagUrl = (
  flagCode: string | null,
  size: 'small' | 'medium' | 'large' = 'medium',
): string => {
  if (!flagCode) {
    return getFallbackFlag();
  }

  // Handle special regional flags with inline SVG data URLs
  const inlineSvgFlags: Record<string, string> = {
    CAT: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 810 540'%3E%3Crect width='810' height='540' fill='%23FCDD09'/%3E%3Cpath stroke='%23DA121A' stroke-width='60' d='M0,90H810m0,120H0m0,120H810m0,120H0'/%3E%3C/svg%3E",
  };

  const upperCode = flagCode.toUpperCase();
  if (inlineSvgFlags[upperCode]) {
    return inlineSvgFlags[upperCode];
  }

  // Handle standard country codes
  const normalizedCode = normalizeFlagCode(flagCode);

  // Size mapping for flagcdn.com
  const sizeMap = {
    small: 'w20', // 20px width
    medium: 'w40', // 40px width
    large: 'w80', // 80px width
  };

  return `https://flagcdn.com/${sizeMap[size]}/${normalizedCode.toLowerCase()}.png`;
};

/**
 * Get flag emoji from flag code (alternative to images)
 */
export const getFlagEmoji = (flagCode: string | null): string => {
  if (!flagCode) return '🏳️';

  const flagEmojiMap: Record<string, string> = {
    GB: '🇬🇧',
    ES: '🇪🇸',
    CAT: '🏴󠁥󠁳󠁣󠁴󠁿', // Catalonia flag emoji
    US: '🇺🇸',
    FR: '🇫🇷',
    DE: '🇩🇪',
    IT: '🇮🇹',
    PT: '🇵🇹',
    EN: '🇬🇧', // English -> Great Britain
  };

  return flagEmojiMap[flagCode.toUpperCase()] || '🏳️';
};

/**
 * Preload flag image to avoid loading flicker
 */
export const preloadFlag = (flagCode: string | null): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!flagCode) {
      resolve(getFallbackFlag());
      return;
    }

    const flagUrl = getFlagUrl(flagCode);
    const img = new Image();

    img.onload = () => resolve(flagUrl);
    img.onerror = () => resolve(getFallbackFlag());
    img.src = flagUrl;
  });
};
