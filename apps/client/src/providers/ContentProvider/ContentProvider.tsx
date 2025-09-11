import React from 'react';
import type { ContentProviderProps } from './ContentContext.types';
import { ContentContext as Content, DISPLAY_NAME } from './ContentContext';
import { useRouteChangeHandler } from 'hooks/useRouteChangeHandler';

// Component to handle route changes and filter syncing
const RouteChangeHandler = () => {
  useRouteChangeHandler();
  return null; // This component doesn't render anything
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
