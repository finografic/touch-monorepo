export interface ScriptCategory {
  name: string;
  displayName: string;
  emoji: string;
  scripts: ScriptInfo[];
  description?: string;
}

export interface ScriptInfo {
  name: string;
  command: string;
  category: string;
  fullName: string;
  isRecommended?: boolean;
  isFavorite?: boolean;
}

export interface FavoritesCache {
  lastUsed: string[];
  hardcoded: string[];
  timestamp: number;
}

export interface ScriptSelection {
  category: string;
  script: string;
  timestamp: number;
}

export type NavigationAction = 'back' | 'quit' | 'select';

export interface MenuChoice {
  name: string;
  value: string;
  short?: string;
  disabled?: boolean | string;
}
