import type { LoaderFunction } from 'react-router-dom';

import {
  EndpointsContainerType,
  EndpointsDrinkSubtype,
  EndpointsDrinkType,
  EndpointsOrders,
  EndpointsSupportedLanguages,
  EndpointsVolume,
} from 'api/endpoints';
import { AdminRouteIds, ROUTE_FILTER_KEYS } from 'config/app';

type LoaderMap = {
  [K in keyof typeof ROUTE_FILTER_KEYS]: LoaderFunction;
};

export const LoaderDataHelper: Partial<LoaderMap> = {
  [ROUTE_FILTER_KEYS.main]: async () => {
    // TODO: Implement when ready
    return [];
  },
  [ROUTE_FILTER_KEYS.drinkType]: EndpointsDrinkType.getAll,
  [ROUTE_FILTER_KEYS.drinkSubtype]: async ({ params }) => {
    const { drinkTypeId } = params;
    if (!drinkTypeId) return [];
    return EndpointsDrinkSubtype.getByDrinkTypeId(drinkTypeId);
  },
  [ROUTE_FILTER_KEYS.drinkVolume]: EndpointsVolume.getAll,
  [ROUTE_FILTER_KEYS.containerType]: EndpointsContainerType.getAll,
  [ROUTE_FILTER_KEYS.temperature]: async () => {
    // TODO: Implement when ready
    return EndpointsOrders.getAllReadable();
  },
  [AdminRouteIds.languages]: EndpointsSupportedLanguages.getSupportedLanguages,
};
