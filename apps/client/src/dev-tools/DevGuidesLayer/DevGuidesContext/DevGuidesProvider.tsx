import type { DevGuidesProviderProps } from './DevGuides.types';
import { DevGuidesContext } from './DevGuidesContext';

export const DevGuidesProvider = ({ initialValue, children }: DevGuidesProviderProps) => {
  return <DevGuidesContext.Provider initialValue={{ ...initialValue }}>{children}</DevGuidesContext.Provider>;
};
