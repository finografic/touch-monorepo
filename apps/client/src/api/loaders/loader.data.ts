import { EndpointHelper } from 'api/api.endpoints';
import { OrderFieldKeys } from 'constants/app.config';
import type { LoaderFunction } from 'react-router-dom';

type LoaderMap = {
  [K in keyof typeof OrderFieldKeys]: LoaderFunction;
};

export const LoaderDataHelper: Partial<LoaderMap> = {
  [OrderFieldKeys.home]: async () => {
    // TODO: Implement when ready
    return [];
  },
  [OrderFieldKeys.drinkType]: EndpointHelper.getDrinkTypes,
  [OrderFieldKeys.drinkSubtype]: async ({ params }) => {
    const { drinkTypeId } = params;
    return EndpointHelper.getDrinkSubtype({ drinkTypeId: drinkTypeId as string });
  },
  [OrderFieldKeys.drinkVolume]: EndpointHelper.getDrinkVolumes,
  [OrderFieldKeys.containerType]: EndpointHelper.getContainerTypes,
  [OrderFieldKeys.temperature]: async ({ params }) => {
    // TODO: Implement when ready
    log('__DEV: LoaderDataHelper { params }', 'grey', params);
    return [];
    // return EndpointHelper.getTemperatureProfile(params.temperatureProfileId as string);
  },
  /*
  [OrderFieldKeys.initialTemperature]: async () => {
    // TODO: Implement when ready
    return [];
  },
  [OrderFieldKeys.finalTemperature]: async () => {
    // TODO: Implement when ready
    return [];
  },
  */
};
