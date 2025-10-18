import type { Location, NavigateOptions } from 'react-router-dom';

import type { RouteConfig } from 'routes/routes.types';
import type { Generic } from 'types/data.types';

export interface LocationState extends Generic {
  from?: RouteConfig & {
    pathname?: string;
  };
  action?: string;
}

export interface LocationWithState extends Partial<Location> {
  state?: LocationState;
  location: Location;
}

export interface LocationWithState__V2 extends NavigateOptions {
  state?: LocationState;
  location: Location;
}
