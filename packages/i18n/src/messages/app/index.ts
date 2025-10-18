import { messages as en } from './messages.en-GB';
import { messages as es } from './messages.es-ES';
// import { messages as ca } from './messages.ca-ES';

export const appMessages = {
  'en-GB': en,
  'es-ES': es,
  // 'ca-ES': ca,
};

export type AvailableLanguages = keyof typeof appMessages;
export type MessagesAny = typeof en; // or unify via `&` if you need strict completeness

export function getAppMessages(language: AvailableLanguages): MessagesAny {
  return appMessages[language] ?? en;
}
