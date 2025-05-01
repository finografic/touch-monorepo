import type { RouteObject } from 'react-router-dom';

export interface RouteContextValues {
  routes: RouteObject[];
  isInitialized: boolean;
}
