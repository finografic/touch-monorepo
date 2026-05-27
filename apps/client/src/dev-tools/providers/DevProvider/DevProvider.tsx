import { DevGuidesLayer } from 'dev-tools/layers/DevGuidesLayer/DevGuidesLayer';
import { DevContext as Dev, DISPLAY_NAME } from './DevContext';
import type { DevProviderProps } from './DevContext.types';

export const DevProvider = ({ initialValue, children }: DevProviderProps) => {
  if (import.meta.env.PROD) {
    return children;
  }

  return (
    <Dev.Provider initialValue={initialValue}>
      <DevGuidesLayer>{children}</DevGuidesLayer>
    </Dev.Provider>
  );
};

DevProvider.displayName = `${DISPLAY_NAME}Provider`;
