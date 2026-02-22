import { TEMP_CONSUME_DEFAULT, TEMP_FREEZE_DEFAULT } from '@workspace/shared/constants';

import { useMutation } from '@tanstack/react-query';
import { type DrinkSubtypeUpdate, EndpointsDrinkSubtype } from 'api/endpoints';

import type { DrinkSubtype } from 'types/models/drink-type.model';

export interface CreateDrinkSubtypeInput {
  name: string;
  drinkTypeId: string;
  defaultTempConsume?: number;
  defaultTempFreeze?: number;
  translations?: Record<string, string>;
}

export const useCreateDrinkSubtype = () => {
  return useMutation({
    mutationFn: async (data: CreateDrinkSubtypeInput): Promise<DrinkSubtype> => {
      const updates: DrinkSubtypeUpdate & { drinkTypeId: string } = {
        name: data.name,
        drinkTypeId: data.drinkTypeId,
        defaultTempConsume: data.defaultTempConsume ?? TEMP_CONSUME_DEFAULT,
        defaultTempFreeze: data.defaultTempFreeze ?? TEMP_FREEZE_DEFAULT,
        translations: data.translations || {},
      };
      return EndpointsDrinkSubtype.create(updates);
    },
  });
};
