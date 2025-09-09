import type { DevProviderProps } from './DevContext.types';
import { DevContext as Dev, DISPLAY_NAME } from './DevContext';

export const DevProvider = ({ initialValue, children }: DevProviderProps) => {
  return <Dev.Provider initialValue={initialValue}>{children}</Dev.Provider>;
};

DevProvider.displayName = `${DISPLAY_NAME}Provider`;
