import { createContext, useContext } from 'react';
import type { RouteObject } from 'react-router-dom';

export interface RouteMetadataValues {
  routes: RouteObject[];
  isInitialized: boolean;
}

export const RouteMetadata = createContext<RouteMetadataValues>({ routes: [], isInitialized: false });

export const useRouteMetadata = () => useContext(RouteMetadata);
