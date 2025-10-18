import { getAppMessages } from '../messages/app';
import type { AvailableLanguages, MessagesAny } from '../messages/app';
// import type { RegionLocale } from '@config/generated/i18n/language.types';

/**
 * Get messages for a specific language/locale.
 */
export function getMessages(language: string): MessagesAny {
  return getAppMessages(language as AvailableLanguages);
}

/**
 * Type-safe version using RegionLocale
 */
export function getMessagesTyped(language: string): MessagesAny {
  return getAppMessages(language as AvailableLanguages);
}
