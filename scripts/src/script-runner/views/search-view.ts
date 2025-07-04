import search from '@inquirer/search';
import chalk from 'chalk';
import type { ScriptInfo } from '../script-runner.types';
import { formatScriptChoice } from './formatters';
import { PAGE_SIZE } from '../scripts.config';
import { calculateScriptColumnWidth } from './alignment.utils';

/**
 * Show global script search menu
 */
export async function showSearchMenu(allScripts: ScriptInfo[]): Promise<string> {
  // Calculate maximum width for alignment
  const maxWidth = calculateScriptColumnWidth(allScripts, true); // showCategory = true for search

  return await search({
    message: chalk.bold('🔍 Search and select a script:'),
    source: async (input: string | undefined) => {
      // If no input, show all scripts
      const query = input || '';

      // Filter scripts based on search query
      const filteredScripts =
        query.trim() === ''
          ? allScripts
          : allScripts.filter((script) => {
              const searchText = `${script.name} ${script.command} ${script.category}`.toLowerCase();
              return searchText.includes(query.toLowerCase());
            });

      // Sort results: favorites first, then recommended, then alphabetically
      const sortedScripts = filteredScripts.sort((a, b) => {
        // Prioritize exact name matches
        if (query) {
          const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase());
          const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase());
          if (aNameMatch !== bNameMatch) return aNameMatch ? -1 : 1;
        }

        // Then sort by favorites and recommended
        if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
        if (a.isRecommended !== b.isRecommended) return a.isRecommended ? -1 : 1;

        // Finally alphabetically
        return a.name.localeCompare(b.name);
      });

      // Convert to menu choices with category indicators
      return sortedScripts.map(
        (script) => formatScriptChoice(script, true, maxWidth), // showCategory = true for search
      );
    },
    pageSize: PAGE_SIZE,
  });
}

/**
 * Check if the search was cancelled
 */
export function isSearchCancelled(result: string): boolean {
  return result === '';
}
