import search from '@inquirer/search';
import chalk from 'chalk';
import type { ScriptCategory, ScriptInfo, MenuChoice } from '../script-runner.types';
import {
  formatCategoryChoice,
  formatFavoritesChoice,
  formatScriptChoice,
  createSeparator,
  NAV_OPTIONS,
} from './formatters';
import { PAGE_SIZE } from '../scripts.config';
import { calculateCategoryColumnWidth, calculateScriptColumnWidth } from './alignment.utils';

/**
 * Show hybrid menu that supports both category browsing and instant script search
 */
export async function showHybridMenu(
  categories: ScriptCategory[],
  favoriteScripts: ScriptInfo[],
  allScripts: ScriptInfo[],
): Promise<{ type: 'category' | 'script'; value: string }> {
  // Pre-calculate widths for both types
  const categoryMaxWidth = calculateCategoryColumnWidth(categories, favoriteScripts.length > 0, false);
  const scriptMaxWidth = calculateScriptColumnWidth(allScripts, false); // showCategory = false for clean search results

  return await search({
    message: chalk.bold('📦 Browse categories or start typing to search scripts:'),
    source: async (input: string | undefined) => {
      const query = (input || '').trim();

      // If no input, show category navigation
      if (query === '') {
        const choices: MenuChoice[] = [];

        // Add favorites as first option if any exist
        if (favoriteScripts.length > 0) {
          choices.push({
            ...formatFavoritesChoice(favoriteScripts.length, categoryMaxWidth),
            value: 'category:favorites',
          });
          choices.push({
            ...createSeparator(),
            value: 'separator:1',
          });
        }

        // Add categories
        categories.forEach((category, index) => {
          choices.push({
            ...formatCategoryChoice(category, categoryMaxWidth),
            value: `category:${category.name}`,
          });
        });

        // No quit option needed - users can use Ctrl+C or ESC

        return choices;
      }

      // If there's input, show filtered scripts for search
      const filteredScripts = allScripts.filter((script) => {
        const searchText = `${script.name} ${script.command} ${script.category}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      });

      // Sort results: favorites first, then recommended, then alphabetically
      const sortedScripts = filteredScripts.sort((a, b) => {
        // Prioritize exact name matches
        const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase());
        const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase());
        if (aNameMatch !== bNameMatch) return aNameMatch ? -1 : 1;

        // Then sort by favorites and recommended
        if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
        if (a.isRecommended !== b.isRecommended) return a.isRecommended ? -1 : 1;

        // Finally alphabetically
        return a.name.localeCompare(b.name);
      });

      // Convert to menu choices without category indicators
      return sortedScripts.map((script) => ({
        ...formatScriptChoice(script, false, scriptMaxWidth), // showCategory = false for clean search results
        value: `script:${script.fullName}`,
      }));
    },
    pageSize: PAGE_SIZE,
  }).then((result: string) => {
    // Parse the result to determine type and value
    if (result.startsWith('category:')) {
      return { type: 'category' as const, value: result.replace('category:', '') };
    }

    if (result.startsWith('script:')) {
      return { type: 'script' as const, value: result.replace('script:', '') };
    }

    if (result.startsWith('separator:') || result === 'separator') {
      // Handle separators by returning a special type that the caller can ignore
      return { type: 'category' as const, value: 'separator' };
    }

    // Fallback
    return { type: 'category' as const, value: result };
  });
}

/**
 * Check if the result is a separator (to be ignored)
 */
export function isHybridSeparator(result: { type: string; value: string }): boolean {
  return result.value === 'separator';
}
