import type { ReactElement } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { User } from 'src/api/auth';
import type { OrderFieldKey } from 'types/orders.types';

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
  parent?: RouteConfig | null;
  children?: RouteConfig[];
  element?: ReactElement;

  readonly pathname?: string; // computed during transformation, not set manually
}

export type RouteMetadata = Omit<RouteConfig, 'children' | 'element'>;
