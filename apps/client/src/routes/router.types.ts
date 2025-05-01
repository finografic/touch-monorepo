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
  pathname?: string;
  parent?: RouteConfig | null;
  children?: RouteConfig[];
  element?: ReactElement;
}
