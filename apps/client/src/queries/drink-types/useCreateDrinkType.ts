import { useMutation } from '@tanstack/react-query';

import { EndpointsDrinkType, type DrinkTypeUpdate } from 'api/endpoints';
import type { DrinkType } from 'types/models/drink-type.model';

export interface CreateDrinkTypeInput {
  name: string;
  hasSubtypes?: boolean;
  defaultTempConsume?: number;
  defaultTempFreeze?: number;
  translations?: Record<string, string>;
}

export const useCreateDrinkType = () => {
  return useMutation({
    mutationFn: async (data: CreateDrinkTypeInput): Promise<DrinkType> => {
      const updates: DrinkTypeUpdate = {
        name: data.name,
        hasSubtypes: data.hasSubtypes ?? false,
        defaultTempConsume: data.defaultTempConsume ?? 5,
        defaultTempFreeze: data.defaultTempFreeze ?? -2,
        translations: data.translations || {},
      };
      return EndpointsDrinkType.create(updates);
    },
  });
};
