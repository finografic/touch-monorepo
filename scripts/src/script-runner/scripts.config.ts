import chalk from 'chalk';

// ======================================================================== //
// NOTE: STYLE INTERFACES

/**
 * Valid chalk colors as string literals
 */
export type ChalkColor =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray'
  | 'grey'
  | 'blackBright'
  | 'redBright'
  | 'greenBright'
  | 'yellowBright'
  | 'blueBright'
  | 'magentaBright'
  | 'cyanBright'
  | 'whiteBright';

/**
 * Valid chalk weight/style modifiers
 */
export type ChalkWeight = 'normal' | 'bold' | 'dim';

/**
 * Style configuration interface
 */
export interface StyleConfig {
  color: ChalkColor;
  weight: ChalkWeight;
  prefix: string;
  suffix: string;
  maxLength?: number;
}

// ======================================================================== //
// NOTE: HARDCODED FAVORITES

// Hardcoded favorites - frequently used scripts
export const HARDCODED_FAVORITES = [
  'dev',
  'dev.server',
  'dev.client',
  'db.reset.v3-RECOMMENDED',
  'db.studio',
  'build',
  'lint.fix',
];

/**
 * Extract clean category name from stylized label
 * Removes decorative chars like "========== " and "·········· "
 */
export function extractCleanCategoryName(stylizedName: string): string {
  return stylizedName.replace(/^[=·\s]+/, '').trim();
}

// Category mappings with emojis and custom stylized labels matching actual package.json sections
export const CATEGORY_CONFIG: Record<string, { emoji: string; displayName: string; description?: string }> = {
  'dev': { emoji: '🚀', displayName: '========== DEV', description: 'Development and debugging scripts' },
  'i18n': {
    emoji: '🌍',
    displayName: '·········· I18N',
    description: 'Translation and locale management',
  },
  'reset': { emoji: '🔄', displayName: '·········· RESET', description: 'Clean slate operations' },
  'build': { emoji: '🏗️', displayName: '·········· BUILD', description: 'Build and compilation scripts' },
  'clean': {
    emoji: '🧹',
    displayName: '·········· CLEAN',
    description: 'Clean up generated files and caches',
  },
  'packages': {
    emoji: '📦',
    displayName: '·········· PACKAGES',
    description: 'Package and dependency management',
  },
  'db.batch': {
    emoji: '🗄️',
    displayName: '·········· DB.BATCH',
    description: 'Database batch operations and resets',
  },
  'db.utils': { emoji: '🔧', displayName: '·········· DB.UTILS', description: 'Database utility operations' },
  'db.data': {
    emoji: '📊',
    displayName: '·········· DB.DATA',
    description: 'Database data operations and migrations',
  },
  'linting': { emoji: '✨', displayName: '·········· LINTING', description: 'Linting and formatting' },
  'lint.packages': {
    emoji: '📦',
    displayName: '·········· LINT.PACKAGES',
    description: 'Package-specific linting',
  },
  'update.deps': {
    emoji: '⬆️',
    displayName: '·········· UPDATE.DEPS',
    description: 'Dependency and package updates',
  },
  'utils': { emoji: '🔧', displayName: '·········· UTILS', description: 'Utility and helper scripts' },
  'changeset': {
    emoji: '📋',
    displayName: '·········· CHANGESET',
    description: 'Version management and releases',
  },
};

// ======================================================================== //
// NOTE: SYS CONFIG CONSTANTS

export const CACHE_FOLDER = '.script-runner';
export const CACHE_FILENAME = 'script-runner-favorites.json';
export const MAX_RECENT_SCRIPTS = 5;

export const PAGE_SIZE = 25;
export const COL_GAP = 5;

// ======================================================================== //
// NOTE: UI CONFIG CONSTANTS

export const SHOW_CATEGORY_ICONS = false;
export const SHOW_BADGES = false; // Control visibility of ⭐ and 🔥 badges

/**
 * Inquirer hover/selection colors - typed constants
 */
export const INQUIRER_COLORS = {
  hover: 'cyan' as const,
  selected: 'cyan' as const,
  separator: 'dim' as const,
} as const;

/**
 * Inquirer theme configuration
 */
export const INQUIRER_THEME = {
  style: {
    answer: chalk.cyan,
    message: chalk.bold,
    error: chalk.red,
    defaultAnswer: chalk.dim,
    help: chalk.dim,
    highlight: chalk.cyan,
    key: chalk.cyan.bold,
  },
} as const;

export const HR = {
  length: 50,
  char: '─',
  color: chalk.dim,
};

export const LABEL_STYLE: StyleConfig = {
  color: 'white',
  weight: 'normal',
  prefix: '',
  suffix: '',
  maxLength: undefined,
};

export const DESCRIPTION_STYLE: StyleConfig = {
  color: 'gray', // Lighter grey like inquirer uses for "(Use arrow keys)"
  weight: 'normal',
  prefix: '',
  suffix: '',
  maxLength: 200,
};
