import type { ReactElement } from 'react';
import type { RouteObject } from 'react-router-dom';

import type { PATHS } from 'config/routes';
import type { User } from 'types/auth.types';
import type { RouteButtonConfig } from 'types/button.types';
import type { FilterKey } from 'types/orders.types';

export type RoutePath = (typeof PATHS)[keyof typeof PATHS];

export interface RouterContext {
  auth: {
    user: User | undefined;
  };
}

export interface RouteConfig extends Omit<RouteObject, 'element' | 'children'> {
  path?: string;
  id?: string;
  filterKey?: FilterKey;
  title?: string;
  description?: string;
  buttons?: RouteButtonConfig;
  parent?: RouteConfig | null;
  children?: RouteConfig[];
  element?: ReactElement;

  // Navigation properties
  navigation?: {
    next?: string; // Path to next step in flow
    previous?: string; // Path to previous step in flow
    flowStep?: number; // Order in the flow (0-based)
    condition?: (filters: any) => boolean; // Function to determine if route should be included
  };

  readonly pathname?: string; // computed during transformation, not set manually
}

export type RouteMetadata = Omit<RouteConfig, 'children' | 'element'>;
