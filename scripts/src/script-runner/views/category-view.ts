import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import type { ScriptCategory, ScriptInfo, MenuChoice } from '../script-runner.types';
import {
  formatCategoryChoice,
  formatFavoritesChoice,
  // formatSearchChoice removed
  createSeparator,
  NAV_OPTIONS,
} from './formatters';
import { PAGE_SIZE } from '../scripts.config';
import { calculateCategoryColumnWidth } from './alignment.utils';

const FAVORITES_CATEGORY = '⭐ Favorites';

/**
 * Show category selection menu
 */
export async function showCategoryMenu(
  categories: ScriptCategory[],
  favoriteScripts: ScriptInfo[],
  allScriptsCount: number,
): Promise<string> {
  const choices: MenuChoice[] = [];

  // Calculate maximum width for alignment (including search option)
  const maxWidth = calculateCategoryColumnWidth(categories, favoriteScripts.length > 0, true);

  // Add search as first option
  // formatSearchChoice removed - using hybrid search instead
  choices.push(createSeparator());

  // Add favorites as second option if any exist
  if (favoriteScripts.length > 0) {
    choices.push(formatFavoritesChoice(favoriteScripts.length, maxWidth));
    choices.push(createSeparator());
  }

  // Add categories
  categories.forEach((category) => {
    choices.push(formatCategoryChoice(category, maxWidth));
  });

  // No quit option needed - users can use Ctrl+C or ESC

  return await select({
    message: chalk.bold('📦 Select a script category:'),
    choices,
    pageSize: PAGE_SIZE,
  });
}

/**
 * Check if the selected category is favorites
 */
export function isFavoritesCategory(selectedCategory: string): boolean {
  return selectedCategory === FAVORITES_CATEGORY;
}

export { FAVORITES_CATEGORY };
