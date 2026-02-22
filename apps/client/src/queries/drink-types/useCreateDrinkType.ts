import { TEMP_CONSUME_DEFAULT, TEMP_FREEZE_DEFAULT } from '@workspace/shared/constants';

import { useMutation } from '@tanstack/react-query';
import { type DrinkTypeUpdate, EndpointsDrinkType } from 'api/endpoints';

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
        defaultTempConsume: data.defaultTempConsume ?? TEMP_CONSUME_DEFAULT,
        defaultTempFreeze: data.defaultTempFreeze ?? TEMP_FREEZE_DEFAULT,
        translations: data.translations || {},
      };
      return EndpointsDrinkType.create(updates);
    },
  });
};
