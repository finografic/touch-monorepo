import type { LoaderFunction } from 'react-router-dom';

import {
  EndpointsContainerTypes,
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
  [ROUTE_FILTER_KEYS.drinkType]: EndpointsDrinkType.getDrinkTypes,
  [ROUTE_FILTER_KEYS.drinkSubtype]: async ({ params }) => {
    const { drinkTypeId } = params;
    // Note: This endpoint needs to be added to EndpointsDrinkSubtype
    return EndpointsDrinkSubtype.getDrinkSubtypes?.({ drinkTypeId: drinkTypeId as string }) || [];
  },
  [ROUTE_FILTER_KEYS.drinkVolume]: EndpointsVolume.getDrinkVolumes,
  [ROUTE_FILTER_KEYS.containerType]: EndpointsContainerTypes.getAll,
  [ROUTE_FILTER_KEYS.temperature]: async () => {
    // TODO: Implement when ready
    return EndpointsOrders.getAllReadable();
  },
  [AdminRouteIds.languages]: EndpointsSupportedLanguages.getSupportedLanguages,
};
