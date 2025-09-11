import type { ContentProviderProps } from './ContentContext.types';
import { ContentContext as Content, DISPLAY_NAME } from './ContentContext';
import { useRouteChangeHandler } from 'hooks/useRouteChangeHandler';

const RouteChangeHandler = () => {
  useRouteChangeHandler();
  return null;
};

export const ContentProvider = ({ initialValue, children }: ContentProviderProps) => {
  return (
    <Content.Provider initialValue={initialValue}>
      <RouteChangeHandler />
      {children}
    </Content.Provider>
  );
};

ContentProvider.displayName = `${DISPLAY_NAME}Provider`;
