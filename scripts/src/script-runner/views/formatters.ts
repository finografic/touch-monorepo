import chalk from 'chalk';
import type { ScriptCategory, ScriptInfo, MenuChoice } from '../script-runner.types';
import {
  HR,
  COL_GAP,
  LABEL_STYLE,
  DESCRIPTION_STYLE,
  type StyleConfig,
  type ChalkColor,
  extractCleanCategoryName,
  SHOW_CATEGORY_ICONS,
  SHOW_BADGES,
  INQUIRER_COLORS,
} from '../scripts.config';
import { padToWidth, getDisplayWidth } from './alignment.utils';

/**
 * Type-safe chalk color mapping
 */
function getChalkColor(colorName: ChalkColor) {
  const colorMap = {
    black: chalk.black,
    red: chalk.red,
    green: chalk.green,
    yellow: chalk.yellow,
    blue: chalk.blue,
    magenta: chalk.magenta,
    cyan: chalk.cyan,
    white: chalk.white,
    gray: chalk.gray,
    grey: chalk.grey,
    blackBright: chalk.blackBright,
    redBright: chalk.redBright,
    greenBright: chalk.greenBright,
    yellowBright: chalk.yellowBright,
    blueBright: chalk.blueBright,
    magentaBright: chalk.magentaBright,
    cyanBright: chalk.cyanBright,
    whiteBright: chalk.whiteBright,
  } as const;

  return colorMap[colorName];
}

/**
 * Apply style configuration to text
 */
function applyStyle(text: string, style: StyleConfig): string {
  let result = text;

  // Apply truncation if maxLength is specified
  if (style.maxLength && result.length > style.maxLength) {
    result = result.substring(0, style.maxLength - 3) + '...';
  }

  // Apply prefix and suffix
  result = `${style.prefix}${result}${style.suffix}`;

  // Apply color - use type-safe color mapping
  let styledResult = getChalkColor(style.color)(result);

  // Apply weight if specified (chalk doesn't have direct weight, but we can use bold/dim)
  if (style.weight === 'bold') {
    styledResult = chalk.bold(styledResult);
  } else if (style.weight === 'dim') {
    styledResult = chalk.dim(styledResult);
  }

  return styledResult;
}

/**
 * Format script choice for display
 */
export function formatScriptChoice(script: ScriptInfo, showCategory = false, maxWidth?: number): MenuChoice {
  const indicators: string[] = [];

  if (SHOW_BADGES) {
    if (script.isFavorite) indicators.push('⭐');
    if (script.isRecommended) indicators.push('🔥');
  }

  const categoryStr = showCategory ? chalk.gray(` [${script.category}]`) : '';
  const emojiStr = indicators.length > 0 ? ` ${indicators.join('')}` : '';

  // Apply styles using the config objects
  const nameStyled = applyStyle(script.name, LABEL_STYLE);
  const commandStyled = applyStyle(script.command, DESCRIPTION_STYLE);

  // Left side content (for width calculation) - without emojis for alignment
  const leftContent = `${script.name}${categoryStr}`;
  const leftFormatted = `${nameStyled}${categoryStr}`;

  // Apply alignment if maxWidth is provided, then add emojis at the end
  const finalName = maxWidth
    ? `${leftFormatted}${' '.repeat(Math.max(0, maxWidth - getDisplayWidth(leftContent) + COL_GAP))}${commandStyled}${emojiStr}`
    : `${leftFormatted} ${commandStyled}${emojiStr}`;

  return {
    name: finalName,
    value: script.fullName,
    short: script.name,
  };
}

/**
 * Format category choice for display
 */
export function formatCategoryChoice(category: ScriptCategory, maxWidth?: number): MenuChoice {
  const scriptCount = category.scripts.length;
  const favCount = category.scripts.filter((s) => s.isFavorite).length;
  const recCount = category.scripts.filter((s) => s.isRecommended).length;

  const badges: string[] = [];
  if (SHOW_BADGES) {
    if (favCount > 0) badges.push(`${favCount}⭐`);
    if (recCount > 0) badges.push(`${recCount}🔥`);
  }

  const badgeStr = badges.length > 0 ? ` ${badges.join(' ')}` : '';
  const paddedCount = scriptCount < 10 ? ` ${scriptCount}` : `${scriptCount}`;
  const countInfo = `${paddedCount} scripts`;

  // Extract clean category name from stylized label
  const cleanName = extractCleanCategoryName(category.displayName);

  // Apply styles
  const nameStyled = applyStyle(cleanName, LABEL_STYLE);
  const countStyled = applyStyle(countInfo, DESCRIPTION_STYLE);

  // Left side content (for width calculation) - without emoji for alignment
  const leftContent = cleanName;
  const leftFormatted = nameStyled;

  // Conditionally add emoji based on SHOW_CATEGORY_ICONS flag
  const emojiStr = SHOW_CATEGORY_ICONS ? ` ${category.emoji}` : '';

  // Apply alignment if maxWidth is provided, then add emoji and badges at the end
  const finalName = maxWidth
    ? `${leftFormatted}${' '.repeat(Math.max(0, maxWidth - getDisplayWidth(leftContent) + COL_GAP))}${countStyled}${badgeStr}${emojiStr}`
    : `${leftFormatted} ${countStyled}${badgeStr}${emojiStr}`;

  return {
    name: finalName,
    value: category.name,
    short: cleanName, // Use clean name instead of stylized displayName
  };
}

/**
 * Create a visual separator line
 */
export function createSeparator(): MenuChoice {
  return {
    name: HR.color(HR.char.repeat(HR.length)),
    value: 'separator',
  };
}

/**
 * Check if a selection is a separator
 */
export function isSeparator(value: string): boolean {
  return value === 'separator';
}

/**
 * Format favorites choice for display
 */
export function formatFavoritesChoice(favoriteCount: number, maxWidth?: number): MenuChoice {
  const paddedCount = favoriteCount < 10 ? ` ${favoriteCount}` : `${favoriteCount}`;
  const countInfo = `${paddedCount} scripts`;

  // Apply styles
  const nameStyled = applyStyle('Favorites', LABEL_STYLE);
  const countStyled = applyStyle(countInfo, DESCRIPTION_STYLE);

  // Left side content (for width calculation) - without emoji for alignment
  const leftContent = 'Favorites';
  const leftFormatted = nameStyled;

  // Conditionally add emoji based on SHOW_CATEGORY_ICONS flag
  const emojiStr = SHOW_CATEGORY_ICONS ? ' ⭐' : '';

  // Apply alignment if maxWidth is provided, then add emoji at the end
  const finalName = maxWidth
    ? `${leftFormatted}${' '.repeat(Math.max(0, maxWidth - getDisplayWidth(leftContent) + COL_GAP))}${countStyled}${emojiStr}`
    : `${leftFormatted} ${countStyled}${emojiStr}`;

  return {
    name: finalName,
    value: 'favorites',
    short: 'Favorites',
  };
}

// Removed formatSearchChoice - no longer needed with hybrid search

/**
 * Format navigation options
 */
export const NAV_OPTIONS = {
  back: {
    name: '⬅️  Back to categories',
    value: 'back',
    short: 'Back',
  },
  quit: {
    name: '❌ Quit',
    value: 'quit',
    short: 'Quit',
  },
} as const;
