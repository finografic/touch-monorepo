import type { ScriptCategory, ScriptInfo } from '../script-runner.types';
import { COL_GAP, extractCleanCategoryName, SHOW_BADGES } from '../scripts.config';

/**
 * Strip ANSI escape codes to get the actual display width
 */
export function getDisplayWidth(text: string): number {
  // Remove ANSI escape codes (color codes, etc.)
  return text.replace(/\u001b\[[0-9;]*m/g, '').length;
}

/**
 * Calculate the maximum width needed for the left column of script choices
 */
export function calculateScriptColumnWidth(scripts: ScriptInfo[], showCategory = false): number {
  let maxWidth = 0;

  scripts.forEach((script) => {
    // Build the left side content (without the command)
    const indicators: string[] = [];
    if (SHOW_BADGES) {
      if (script.isFavorite) indicators.push('⭐');
      if (script.isRecommended) indicators.push('🔥');
    }

    const indicatorStr = indicators.length > 0 ? `${indicators.join('')} ` : '';
    const categoryStr = showCategory ? ` [${script.category}]` : '';
    const leftContent = `${indicatorStr}${script.name}${categoryStr}`;

    const width = getDisplayWidth(leftContent);
    maxWidth = Math.max(maxWidth, width);
  });

  return maxWidth;
}

/**
 * Calculate the maximum width needed for the left column of category choices
 */
export function calculateCategoryColumnWidth(
  categories: ScriptCategory[],
  includesFavorites = false,
  includesSearch = false,
): number {
  let maxWidth = 0;

  // Check search if included
  if (includesSearch) {
    const searchText = 'Search all scripts';
    maxWidth = Math.max(maxWidth, getDisplayWidth(searchText));
  }

  // Check favorites if included
  if (includesFavorites) {
    const favoritesText = 'Favorites';
    maxWidth = Math.max(maxWidth, getDisplayWidth(favoritesText));
  }

  // Check all categories
  categories.forEach((category) => {
    const leftContent = extractCleanCategoryName(category.displayName);
    const width = getDisplayWidth(leftContent);
    maxWidth = Math.max(maxWidth, width);
  });

  return maxWidth;
}

/**
 * Pad text to a specific width for column alignment
 */
export function padToWidth(text: string, targetWidth: number, gap = COL_GAP): string {
  const displayWidth = getDisplayWidth(text);
  const padding = Math.max(0, targetWidth - displayWidth + gap);
  return text + ' '.repeat(padding);
}
