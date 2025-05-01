import { createContext, useContext } from 'react';
import type { RouteObject } from 'react-router-dom';

export interface RouteMetadataValues {
  routes: RouteObject[];
  isInitialized: boolean;
}

export const RouteMetadata = createContext<RouteMetadataValues>({ routes: [], isInitialized: false });

/**
 * Hook to access the current route's metadata and enhanced routes information.
 * Provides access to route metadata attached via the withRouteMetadata utility.
 */
export const useRouteMetadata = () => useContext(RouteMetadata);
