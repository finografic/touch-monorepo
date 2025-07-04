import fs from 'node:fs';
import path from 'node:path';
import type { ScriptCategory, ScriptInfo } from './script-runner.types';
import { CATEGORY_CONFIG, HARDCODED_FAVORITES } from './scripts.config';

/**
 * Check if a script name is a decorative separator
 */
export function isDecorativeSeparator(scriptName: string): boolean {
  return (
    /^[=·•\-\s]+/.test(scriptName) ||
    scriptName.includes('=====') ||
    scriptName.includes('·····') ||
    scriptName.includes('-----')
  );
}

/**
 * Extract clean section name from decorative separator
 */
export function extractSectionName(decorativeName: string): string {
  // Remove decorative characters and extract the section name
  return decorativeName
    .replace(/^[=·•\-\s]+/, '') // Remove leading decorative chars
    .replace(/[=·•\-\s]+$/, '') // Remove trailing decorative chars
    .trim();
}

/**
 * Check if script is recommended (has special flags)
 */
export function isRecommendedScript(scriptName: string): boolean {
  return (
    scriptName.includes('RECOMMENDED') || scriptName.includes('preferred') || scriptName.includes('default')
  );
}

/**
 * Parse package.json and extract script information, respecting section structure
 */
export function parsePackageScripts(packageJsonPath: string = 'package.json'): ScriptInfo[] {
  try {
    const fullPath = path.resolve(packageJsonPath);
    const packageJson = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    const scripts = packageJson.scripts || {};

    const scriptEntries = Object.entries(scripts);
    const parsedScripts: ScriptInfo[] = [];
    let currentSection = 'UTILS'; // Default section for scripts before any header

    for (const [name, command] of scriptEntries) {
      if (isDecorativeSeparator(name)) {
        // Update current section from decorative separator
        currentSection = extractSectionName(name);
        continue;
      }

      // Add script to current section
      parsedScripts.push({
        name: name, // Keep full script name
        command: command as string,
        category: currentSection.toLowerCase(), // Use actual section name as category
        fullName: name,
        isRecommended: isRecommendedScript(name),
        isFavorite: HARDCODED_FAVORITES.includes(name),
      });
    }

    return parsedScripts;
  } catch (error) {
    console.error('Error parsing package.json:', error);
    return [];
  }
}

/**
 * Group scripts by category
 */
export function groupScriptsByCategory(scripts: ScriptInfo[]): ScriptCategory[] {
  const grouped = scripts.reduce(
    (acc, script) => {
      if (!acc[script.category]) {
        acc[script.category] = [];
      }
      acc[script.category].push(script);
      return acc;
    },
    {} as Record<string, ScriptInfo[]>,
  );

  return Object.entries(grouped)
    .map(([categoryName, categoryScripts]) => {
      const config = CATEGORY_CONFIG[categoryName] || {
        emoji: '📄',
        displayName: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
        description: `${categoryName} related scripts`,
      };

      return {
        name: categoryName,
        displayName: config.displayName,
        emoji: config.emoji,
        description: config.description,
        scripts: categoryScripts.sort((a, b) => {
          // Sort favorites first, then recommended, then alphabetically
          if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
          if (a.isRecommended !== b.isRecommended) return a.isRecommended ? -1 : 1;
          return a.name.localeCompare(b.name);
        }),
      };
    })
    .sort((a, b) => {
      // Sort categories by priority matching package.json order
      const priority = [
        'dev',
        'i18n',
        'reset',
        'build',
        'clean',
        'packages',
        'db.batch',
        'db.utils',
        'db.data',
        'linting',
        'lint.packages',
        'update.deps',
        'utils',
        'changeset',
      ];
      const aPriority = priority.indexOf(a.name);
      const bPriority = priority.indexOf(b.name);

      if (aPriority !== -1 && bPriority !== -1) {
        return aPriority - bPriority;
      }
      if (aPriority !== -1) return -1;
      if (bPriority !== -1) return 1;

      return a.displayName.localeCompare(b.displayName);
    });
}
