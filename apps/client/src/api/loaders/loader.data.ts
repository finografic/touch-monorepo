import type { LoaderFunction } from 'react-router-dom';

import { EndpointHelper } from 'api/api.endpoints';

import { AdminFieldKeys, ROUTE_FILTER_KEYS } from 'config/app';

type LoaderMap = {
  [K in keyof typeof ROUTE_FILTER_KEYS]: LoaderFunction;
};

export const LoaderDataHelper: Partial<LoaderMap> = {
  [ROUTE_FILTER_KEYS.main]: async () => {
    // TODO: Implement when ready
    return [];
  },
  [ROUTE_FILTER_KEYS.drinkType]: EndpointHelper.getDrinkTypes,
  [ROUTE_FILTER_KEYS.drinkSubtype]: async ({ params }) => {
    const { drinkTypeId } = params;
    return EndpointHelper.getDrinkSubtypes({ drinkTypeId: drinkTypeId as string });
  },
  [ROUTE_FILTER_KEYS.drinkVolume]: EndpointHelper.getDrinkVolumes,
  [ROUTE_FILTER_KEYS.containerType]: EndpointHelper.getContainerTypes,
  [ROUTE_FILTER_KEYS.temperature]: async ({ params }) => {
    // TODO: Implement when ready
    return EndpointHelper.getOrdersReadable();
    return [];
    // return EndpointHelper.getTemperatureProfile(params.temperatureProfileId as string);
  },
  [AdminFieldKeys.languages]: async () => EndpointHelper.getSupportedLanguages,
};
