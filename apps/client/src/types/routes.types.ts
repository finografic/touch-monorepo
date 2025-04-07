import type { RouteObject } from 'react-router-dom';

export type RouteConfig = RouteObject & {
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
