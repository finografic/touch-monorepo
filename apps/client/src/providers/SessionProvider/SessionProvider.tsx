import { DISPLAY_NAME, SessionContext } from './SessionContext';
import type { SessionProviderProps } from './SessionContext.types';

export const SessionProvider = ({ children, initialValue }: SessionProviderProps) => {
  return <SessionContext.Provider initialValue={initialValue}>{children}</SessionContext.Provider>;
};

SessionProvider.displayName = `${DISPLAY_NAME}Provider`;
