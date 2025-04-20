import type { PageContentProviderProps } from './PageContent.types';
import { PageContentContext as PageContent } from './PageContentContext';
import { DISPLAY_NAME } from './PageContentContext';

export const PageContentProvider = ({ initialValue, children }: PageContentProviderProps) => {
  return <PageContent.Provider initialValue={initialValue}>{children}</PageContent.Provider>;
};

PageContentProvider.displayName = `${DISPLAY_NAME}Provider`;
