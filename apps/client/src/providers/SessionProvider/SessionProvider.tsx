import type { SessionProviderProps } from './SessionContext.types';
import { DISPLAY_NAME, SessionContext } from './SessionContext';

export const SessionProvider = ({ children, initialValue }: SessionProviderProps) => {
  return <SessionContext.Provider initialValue={initialValue}>{children}</SessionContext.Provider>;
};

SessionProvider.displayName = `${DISPLAY_NAME}Provider`;
