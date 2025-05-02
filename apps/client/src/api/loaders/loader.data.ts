import { EndpointHelper } from 'api/api.endpoints';
import { OrderFieldKeys } from 'constants/app.config';
import type { LoaderFunction } from 'react-router-dom';

type LoaderMap = {
  [K in keyof typeof OrderFieldKeys]: LoaderFunction;
};

export const LoaderDataHelper: LoaderMap = {
  [OrderFieldKeys.drinkType]: EndpointHelper.getDrinkTypes,
  [OrderFieldKeys.drinkSubtype]: async () => {
    // TODO: Implement when ready
    return [];
  },
  [OrderFieldKeys.drinkVolume]: async () => {
    // TODO: Implement when ready
    return [];
  },
  [OrderFieldKeys.containerType]: async () => {
    // TODO: Implement when ready
    return [];
  },
  [OrderFieldKeys.initialTemperature]: async () => {
    // TODO: Implement when ready
    return [];
  },
  [OrderFieldKeys.finalTemperature]: async () => {
    // TODO: Implement when ready
    return [];
  },
};
