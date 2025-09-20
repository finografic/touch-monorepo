import type { ReactElement } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { PATHS } from 'routes/routes.config';
import type { User } from 'src/api/auth';
import type { OrderFieldKey } from 'types/orders.types';
import type { RouteButtonConfig } from 'types/button.types';

export type RoutePath = (typeof PATHS)[keyof typeof PATHS];

export interface RouterContext {
  auth: {
    user: User | undefined;
  };
}

export interface RouteConfig extends Omit<RouteObject, 'element' | 'children'> {
  path?: string;
  id?: string;
  fieldKey?: OrderFieldKey;
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
