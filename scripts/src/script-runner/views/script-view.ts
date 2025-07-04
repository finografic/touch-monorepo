import search from '@inquirer/search';
import chalk from 'chalk';
import type { ScriptCategory, ScriptInfo, MenuChoice } from '../script-runner.types';
import { formatScriptChoice, createSeparator, NAV_OPTIONS } from './formatters';
import { PAGE_SIZE, extractCleanCategoryName, SHOW_CATEGORY_ICONS } from '../scripts.config';
import { calculateScriptColumnWidth } from './alignment.utils';

// Remove the selectWithBackKey function since we're using search now

/**
 * Show script selection menu for a category with hybrid search functionality
 */
export async function showScriptMenu(
  category: ScriptCategory | 'favorites',
  scripts: ScriptInfo[],
  allScripts: ScriptInfo[],
): Promise<{ type: 'category' | 'script'; value: string }> {
  const isFavorites = category === 'favorites';
  const categoryName = isFavorites
    ? 'Favorites'
    : extractCleanCategoryName((category as ScriptCategory).displayName);

  // Create category header and separator as visual elements
  const categoryIcon = isFavorites ? '⭐' : (category as ScriptCategory).emoji;
  const categoryEmojiStr = SHOW_CATEGORY_ICONS ? `${categoryIcon} ` : '';
  const categoryHeader = `${categoryEmojiStr}${chalk.cyan(categoryName)}`;
  const separator = chalk.dim('─'.repeat(50));

  // Calculate maximum widths for both category scripts and global search
  const categoryMaxWidth = calculateScriptColumnWidth(scripts, isFavorites);
  const globalMaxWidth = calculateScriptColumnWidth(allScripts, false); // showCategory = false for clean search results

  return await search({
    message: `${categoryHeader}\n${separator}`,
    source: async (input: string | undefined) => {
      const query = (input || '').trim();

      // If no input, show category scripts with back option
      if (query === '') {
        const choices: MenuChoice[] = [];

        // Add ".." back option as first choice
        choices.push({
          name: '..',
          value: 'back',
          short: 'Back',
        });

        // Add scripts from this category
        scripts.forEach((script) => {
          choices.push({
            ...formatScriptChoice(script, isFavorites, categoryMaxWidth),
            value: `script:${script.fullName}`,
          });
        });

        return choices;
      }

      // If there's input, show filtered scripts from ALL scripts
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
        ...formatScriptChoice(script, false, globalMaxWidth), // showCategory = false for clean search results
        value: `script:${script.fullName}`,
      }));
    },
    pageSize: PAGE_SIZE,
  }).then((result: string) => {
    // Parse the result to determine type and value
    if (result === 'back') {
      return { type: 'category' as const, value: 'back' };
    }

    if (result.startsWith('script:')) {
      return { type: 'script' as const, value: result.replace('script:', '') };
    }

    // Fallback
    return { type: 'category' as const, value: result };
  });
}

/**
 * Check if the user selected to go back
 */
export function isBackSelected(result: { type: string; value: string }): boolean {
  return result.type === 'category' && result.value === 'back';
}

/**
 * Check if the user selected to quit
 */
export function isQuitSelected(result: { type: string; value: string }): boolean {
  return result.type === 'category' && result.value === 'quit';
}
