import type { LoaderFunction } from 'react-router-dom';

import {
  containerTypesEndpoints,
  drinkSubtypeEndpoints,
  drinkTypeEndpoints,
  ordersEndpoints,
  supportedLanguagesEndpoints,
  volumeEndpoints,
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
  [ROUTE_FILTER_KEYS.drinkType]: drinkTypeEndpoints.getDrinkTypes,
  [ROUTE_FILTER_KEYS.drinkSubtype]: async ({ params }) => {
    const { drinkTypeId } = params;
    // Note: This endpoint needs to be added to drinkSubtypeEndpoints
    return drinkSubtypeEndpoints.getDrinkSubtypes?.({ drinkTypeId: drinkTypeId as string }) || [];
  },
  [ROUTE_FILTER_KEYS.drinkVolume]: volumeEndpoints.getDrinkVolumes,
  [ROUTE_FILTER_KEYS.containerType]: containerTypesEndpoints.getAll,
  [ROUTE_FILTER_KEYS.temperature]: async () => {
    // TODO: Implement when ready
    return ordersEndpoints.getAllReadable();
  },
  [AdminRouteIds.languages]: supportedLanguagesEndpoints.getSupportedLanguages,
};
