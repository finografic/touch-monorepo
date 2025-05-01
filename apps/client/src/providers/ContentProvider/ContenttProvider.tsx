import type { ContentProviderProps } from './ContentContext.types';
import { ContentContext as Content, DISPLAY_NAME } from './ContentContext';

export const ContentProvider = ({ initialValue, children }: ContentProviderProps) => {
  return <Content.Provider initialValue={initialValue}>{children}</Content.Provider>;
};

ContentProvider.displayName = `${DISPLAY_NAME}Provider`;
