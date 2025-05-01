import type { RouteObject } from 'react-router-dom';

export interface RoutesContextValues {
  routes: RouteObject[];
  isInitialized: boolean;
}
