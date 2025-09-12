import type { DevProviderProps } from './DevContext.types';
import { DevContext as Dev, DISPLAY_NAME } from './DevContext';
import { DevGuidesLayer } from 'dev-tools/DevGuidesLayer/DevGuidesLayer';

export const DevProvider = ({ initialValue, children }: DevProviderProps) => {
  return (
    <Dev.Provider initialValue={initialValue}>
      <DevGuidesLayer>{children}</DevGuidesLayer>
    </Dev.Provider>
  );
};

DevProvider.displayName = `${DISPLAY_NAME}Provider`;
