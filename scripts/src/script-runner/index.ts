export { main as default } from './script-runner';
export { HARDCODED_FAVORITES, LABEL_STYLE, DESCRIPTION_STYLE } from './scripts.config';

export type {
  ScriptCategory,
  ScriptInfo,
  FavoritesCache,
  ScriptSelection,
  NavigationAction,
  MenuChoice,
} from './script-runner.types';

export type { StyleConfig, ChalkColor, ChalkWeight } from './scripts.config';

export {
  parsePackageScripts,
  groupScriptsByCategory,
  isDecorativeSeparator,
  isRecommendedScript,
} from './script-parser.utils';

export {
  loadFavoritesCache,
  saveFavoritesCache,
  addToRecentSelections,
  getFavoriteScripts,
  markFavoriteScripts,
  getFavoriteScriptDetails,
  clearRecentSelections,
  getCacheInfo,
} from './favorites.utils';

// Views
export {
  formatScriptChoice,
  formatCategoryChoice,
  // formatSearchChoice removed
  createSeparator,
  formatFavoritesChoice,
  isSeparator,
  NAV_OPTIONS,
} from './views/formatters';

export { showCategoryMenu, isFavoritesCategory, FAVORITES_CATEGORY } from './views/category-view';
export { showScriptMenu, isBackSelected, isQuitSelected } from './views/script-view';
export { showSearchMenu, isSearchCancelled } from './views/search-view';
export { showHybridMenu, isHybridSeparator } from './views/hybrid-menu';
export { executeScript, askRunAnother, showGoodbyeMessage } from './views/execution-view';
export {
  getDisplayWidth,
  calculateScriptColumnWidth,
  calculateCategoryColumnWidth,
  padToWidth,
} from './views/alignment.utils';
