import { createContext, useContext } from 'react';
import type { RouteObject } from 'react-router-dom';

interface RouteMetadataContextValues {
  isInitialized: boolean;
  routes: RouteObject[];
  routesMetadata: RouteObject[];
}

export const RouteMetadataContext = createContext<RouteMetadataContextValues>({
  isInitialized: false,
  routes: [],
  routesMetadata: [],
});

export const useRouteMetadata = (): RouteMetadataContextValues => useContext(RouteMetadataContext);
