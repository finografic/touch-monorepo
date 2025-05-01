import type { ReactElement } from 'react';
import type { User } from 'src/api/auth';

export interface RouterContext {
  auth: {
    user: User | undefined;
  };
}

export interface RouteConfig {
  id?: string;
  title?: string;
  description?: string;
  path?: string;
  parent?: RouteConfig | null;
  children?: RouteConfig[];
  element?: ReactElement;

  readonly pathname?: string; // computed during transformation, not set manually
}

export type RouteMetadata = Omit<RouteConfig, 'children' | 'element'>;
