/**
 * Simple in-memory translation status tracker
 * Tracks the status of ongoing translations by language code
 */

type TranslationStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

interface TranslationStatusInfo {
  status: TranslationStatus;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  progress?: {
    currentTable: string;
    totalTables: number;
    completedTables: number;
  };
}

const translationStatuses = new Map<string, TranslationStatusInfo>();

/**
 * Set translation status for a language
 */
export function setTranslationStatus(
  languageCode: string,
  status: TranslationStatus,
  progress?: TranslationStatusInfo['progress'],
  error?: string,
): void {
  const existing = translationStatuses.get(languageCode);
  const now = new Date();

  translationStatuses.set(languageCode, {
    status,
    startedAt: existing?.startedAt || now,
    completedAt: status === 'completed' || status === 'failed' ? now : undefined,
    progress,
    error,
  });
}

/**
 * Get translation status for a language
 */
export function getTranslationStatus(languageCode: string): TranslationStatusInfo | null {
  return translationStatuses.get(languageCode) || null;
}

/**
 * Clear translation status (after completion and UI has acknowledged)
 */
export function clearTranslationStatus(languageCode: string): void {
  translationStatuses.delete(languageCode);
}

/**
 * Check if translation is in progress for any language
 */
export function hasActiveTranslations(): boolean {
  for (const status of translationStatuses.values()) {
    if (status.status === 'pending' || status.status === 'in-progress') {
      return true;
    }
  }
  return false;
}
