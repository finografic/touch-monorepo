import type { RouteConfig } from 'routes/routes.types';
import { ROUTES_CONFIG } from 'routes/routes.config';
import type { LocationWithState } from 'types/location.types';

// FROM-LOCATION + DEFAULT ROUTE SETTING ================================== //

export const getFromLocation = ({
  location,
  metaRoutes = ROUTES_CONFIG,
}: {
  location: LocationWithState | Location;
  metaRoutes: RouteConfig[];
}): RouteConfig | undefined => {
  const fromLocation = Object.assign({});

  if ('state' in location && location?.state?.from) {
    if (typeof location.state.from === 'object') {
      Object.assign(fromLocation, location.state.from);
      // delete fromLocation.access;
    }
    if (typeof location.state.from === 'string') {
      const match = metaRoutes?.find((route: RouteConfig) => route.path === (location.state as any).from);
      Object.assign(fromLocation, match);
      // delete fromLocation.access;
    }

    return fromLocation;
  }

  const match = metaRoutes?.find((route: RouteConfig) => route?.path?.endsWith(`/${location?.pathname}`));

  if (match) {
    Object.assign(fromLocation, match);
    // delete fromLocation.access;
    return fromLocation;
  }
};
