import type { RouteObject } from 'react-router-dom';

export type RouteConfig = Omit<RouteObject, 'path'> & {
  pathname: string;
  title: string;
  // We can add more route-specific config here later like:
  // fetchConfig?: {
  //   endpoint: string;
  //   params?: Record<string, unknown>;
  // };
  // allowBack?: boolean;
  // allowNext?: boolean;
  // etc...
};
