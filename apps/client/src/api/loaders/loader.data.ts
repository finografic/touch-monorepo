import { EndpointHelper } from 'api/api.endpoints';
import { AdminFieldKeys, SlotFilterKeys } from 'config/app';
import type { LoaderFunction } from 'react-router-dom';

type LoaderMap = {
  [K in keyof typeof SlotFilterKeys]: LoaderFunction;
};

export const LoaderDataHelper: Partial<LoaderMap> = {
  [SlotFilterKeys.main]: async () => {
    // TODO: Implement when ready
    return [];
  },
  [SlotFilterKeys.drinkType]: EndpointHelper.getDrinkTypes,
  [SlotFilterKeys.drinkSubtype]: async ({ params }) => {
    const { drinkTypeId } = params;
    return EndpointHelper.getDrinkSubtypes({ drinkTypeId: drinkTypeId as string });
  },
  [SlotFilterKeys.drinkVolume]: EndpointHelper.getDrinkVolumes,
  [SlotFilterKeys.containerType]: EndpointHelper.getContainerTypes,
  [SlotFilterKeys.temperature]: async ({ params }) => {
    // TODO: Implement when ready
    return EndpointHelper.getOrdersReadable();
    return [];
    // return EndpointHelper.getTemperatureProfile(params.temperatureProfileId as string);
  },
  [AdminFieldKeys.languages]: async () => EndpointHelper.getSupportedLanguages,
};
