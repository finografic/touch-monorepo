import type { DevProviderProps } from './DevContext.types';
import { DevContext as Dev, DISPLAY_NAME } from './DevContext';
import { DevTools } from 'components/DevTools/DevTools';

export const DevProvider = ({ initialValue, children }: DevProviderProps) => {
  return (
    <Dev.Provider initialValue={initialValue}>
      {children}
      <DevTools />
    </Dev.Provider>
  );
};

DevProvider.displayName = `${DISPLAY_NAME}Provider`;
