import { DISPLAY_NAME, MetadataContext as Metadata } from './MetadataContext';
import type { MetadataProviderProps } from './MetadataContext.types';

export const MetadataProvider = ({ initialValue, children }: MetadataProviderProps) => {
  return <Metadata.Provider initialValue={initialValue}>{children}</Metadata.Provider>;
};

MetadataProvider.displayName = `${DISPLAY_NAME}Provider`;
