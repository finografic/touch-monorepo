import { DevGuidesLayer } from 'dev-tools/layers/DevGuidesLayer/DevGuidesLayer';
import { DevContext as Dev, DISPLAY_NAME } from './DevContext';
import type { DevProviderProps } from './DevContext.types';

export const DevProvider = ({ initialValue, children }: DevProviderProps) => {
  const providerChildren = import.meta.env.PROD ? (
    children
  ) : (
    <DevGuidesLayer>{children}</DevGuidesLayer>
  );

  return <Dev.Provider initialValue={initialValue}>{providerChildren}</Dev.Provider>;
};

DevProvider.displayName = `${DISPLAY_NAME}Provider`;
