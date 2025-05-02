import type { RouteObject } from 'react-router-dom';
import { createContext, useContext } from 'react';

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
