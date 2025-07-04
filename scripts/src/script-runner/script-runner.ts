import chalk from 'chalk';
import { pathToFileURL } from 'node:url';
import type { ScriptCategory, ScriptInfo } from './script-runner.types';
import { parsePackageScripts, groupScriptsByCategory } from './script-parser.utils';
import { getFavoriteScriptDetails, markFavoriteScripts } from './favorites.utils';
import { showHybridMenu, isHybridSeparator } from './views/hybrid-menu';
import { showScriptMenu, isBackSelected, isQuitSelected } from './views/script-view';
import { executeScript, askRunAnother, showGoodbyeMessage } from './views/execution-view';
import { isFavoritesCategory, FAVORITES_CATEGORY } from './views/category-view';

console.log(chalk.bold.cyan('\n🚀 Script Runner - Choose and execute npm scripts\n'));

/**
 * Main script runner logic
 */
export async function main(): Promise<void> {
  try {
    // Parse package.json scripts
    console.log(chalk.dim('📄 Parsing package.json scripts...'));
    const allScripts = parsePackageScripts();

    if (allScripts.length === 0) {
      console.log(chalk.yellow('⚠️  No scripts found in package.json'));
      return;
    }

    // Mark favorites and group by category
    const scriptsWithFavorites = markFavoriteScripts(allScripts);
    const categories = groupScriptsByCategory(scriptsWithFavorites);
    const favoriteScripts = getFavoriteScriptDetails(allScripts);

    console.log(chalk.dim(`📊 Found ${allScripts.length} scripts in ${categories.length} categories\n`));

    // Main navigation loop
    while (true) {
      try {
        // Level 1: Hybrid menu - Browse categories or search scripts
        const hybridResult = await showHybridMenu(categories, favoriteScripts, allScripts);

        if (isHybridSeparator(hybridResult)) {
          continue; // Ignore separator selections
        }

        // Handle direct script selection from search
        if (hybridResult.type === 'script') {
          const scriptToExecute = allScripts.find((s) => s.fullName === hybridResult.value);
          if (!scriptToExecute) {
            console.log(chalk.red('❌ Script not found'));
            continue;
          }

          await executeScript(scriptToExecute);

          // Ask if user wants to run another script
          const runAnother = await askRunAnother();

          if (!runAnother) {
            showGoodbyeMessage();
            return;
          }

          // Continue to next iteration (back to hybrid menu)
          continue;
        }

        // Handle category selection
        if (hybridResult.type === 'category') {
          const selectedCategory = hybridResult.value;

          // Get scripts for selected category
          let categoryScripts: ScriptInfo[];
          let categoryInfo: ScriptCategory | 'favorites';

          if (isFavoritesCategory(selectedCategory)) {
            categoryScripts = favoriteScripts;
            categoryInfo = 'favorites';
          } else {
            const category = categories.find((c) => c.name === selectedCategory);
            if (!category) {
              console.log(chalk.red('❌ Category not found'));
              continue;
            }
            categoryScripts = category.scripts;
            categoryInfo = category;
          }

          // Level 2: Script selection within category
          while (true) {
            const scriptResult = await showScriptMenu(categoryInfo, categoryScripts, allScripts);

            if (isBackSelected(scriptResult)) {
              break; // Go back to hybrid menu
            }

            // Handle direct script selection from category or global search
            if (scriptResult.type === 'script') {
              const scriptToExecute = allScripts.find((s) => s.fullName === scriptResult.value);
              if (!scriptToExecute) {
                console.log(chalk.red('❌ Script not found'));
                continue;
              }

              await executeScript(scriptToExecute);

              // Ask if user wants to run another script
              const runAnother = await askRunAnother();

              if (!runAnother) {
                showGoodbyeMessage();
                return;
              }

              // Go back to hybrid menu for next script
              break;
            }
          }
        }
      } catch (error) {
        if (error && typeof error === 'object' && 'name' in error && error.name === 'ExitPromptError') {
          showGoodbyeMessage();
          break;
        }
        throw error;
      }
    }
  } catch (error) {
    console.error(chalk.red('\n❌ Unexpected error:'));
    console.error(error);
    process.exit(1);
  }
}

// Export both the main function and run it if this is the main module
export default main;

// Run when called directly (e.g., via CLI)
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error('Failed to run script runner:', error);
    process.exit(1);
  });
}
