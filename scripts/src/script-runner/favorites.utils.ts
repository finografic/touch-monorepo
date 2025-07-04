import fs from 'node:fs';
import path from 'node:path';
import type { FavoritesCache, ScriptSelection, ScriptInfo } from './script-runner.types';
import { HARDCODED_FAVORITES, CACHE_FOLDER, CACHE_FILENAME, MAX_RECENT_SCRIPTS } from './scripts.config';

const CACHE_DIR = path.join(process.cwd(), CACHE_FOLDER);
const CACHE_FILE = path.join(CACHE_DIR, CACHE_FILENAME);

/**
 * Ensure cache directory exists
 */
function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

/**
 * Load favorites cache from file
 */
export function loadFavoritesCache(): FavoritesCache {
  try {
    ensureCacheDir();

    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      const cache = JSON.parse(data) as FavoritesCache;

      // Validate cache structure
      if (
        cache.lastUsed &&
        Array.isArray(cache.lastUsed) &&
        cache.hardcoded &&
        Array.isArray(cache.hardcoded)
      ) {
        return cache;
      }
    }
  } catch (error) {
    console.warn('Failed to load favorites cache:', error);
  }

  // Return default cache
  return {
    lastUsed: [],
    hardcoded: HARDCODED_FAVORITES,
    timestamp: Date.now(),
  };
}

/**
 * Save favorites cache to file
 */
export function saveFavoritesCache(cache: FavoritesCache): void {
  try {
    ensureCacheDir();
    cache.timestamp = Date.now();
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.warn('Failed to save favorites cache:', error);
  }
}

/**
 * Add script to recent selections
 */
export function addToRecentSelections(scriptName: string): void {
  const cache = loadFavoritesCache();

  // Remove if already exists to avoid duplicates
  cache.lastUsed = cache.lastUsed.filter((name) => name !== scriptName);

  // Add to beginning
  cache.lastUsed.unshift(scriptName);

  // Keep only the most recent
  cache.lastUsed = cache.lastUsed.slice(0, MAX_RECENT_SCRIPTS);

  saveFavoritesCache(cache);
}

/**
 * Get favorite scripts (hardcoded + recent)
 */
export function getFavoriteScripts(): string[] {
  const cache = loadFavoritesCache();

  // Combine hardcoded and recent, removing duplicates while preserving order
  const favorites = [...cache.hardcoded];
  cache.lastUsed.forEach((script) => {
    if (!favorites.includes(script)) {
      favorites.push(script);
    }
  });

  return favorites;
}

/**
 * Mark scripts as favorites in the script list
 */
export function markFavoriteScripts(scripts: ScriptInfo[]): ScriptInfo[] {
  const favoriteNames = getFavoriteScripts();

  return scripts.map((script) => ({
    ...script,
    isFavorite: favoriteNames.includes(script.fullName),
  }));
}

/**
 * Get favorite scripts with their details
 */
export function getFavoriteScriptDetails(allScripts: ScriptInfo[]): ScriptInfo[] {
  const favoriteNames = getFavoriteScripts();
  const cache = loadFavoritesCache();

  return favoriteNames
    .map((name) => allScripts.find((script) => script.fullName === name))
    .filter((script): script is ScriptInfo => script !== undefined)
    .map((script) => ({
      ...script,
      isFavorite: true,
      // Mark recent selections differently from hardcoded
      isRecentlyUsed: cache.lastUsed.includes(script.fullName),
    }));
}

/**
 * Clear recent selections (keep hardcoded favorites)
 */
export function clearRecentSelections(): void {
  const cache = loadFavoritesCache();
  cache.lastUsed = [];
  saveFavoritesCache(cache);
}

/**
 * Get cache file info for debugging
 */
export function getCacheInfo(): {
  cacheFile: string;
  exists: boolean;
  size?: number;
  lastModified?: Date;
} {
  const exists = fs.existsSync(CACHE_FILE);
  let size: number | undefined;
  let lastModified: Date | undefined;

  if (exists) {
    const stats = fs.statSync(CACHE_FILE);
    size = stats.size;
    lastModified = stats.mtime;
  }

  return {
    cacheFile: CACHE_FILE,
    exists,
    size,
    lastModified,
  };
}
