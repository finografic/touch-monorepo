import type { SessionProviderProps } from './SessionContext.types';
import { SessionContext } from './SessionContext';

export const SessionProvider = ({ children, initialValue }: SessionProviderProps) => {
  return <SessionContext.Provider initialValue={initialValue}>{children}</SessionContext.Provider>;
};
