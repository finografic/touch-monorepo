import { useMutation } from '@tanstack/react-query';

import { EndpointsDrinkSubtype, type DrinkSubtypeUpdate } from 'api/endpoints';
import type { DrinkSubtype } from 'types/models/drink-type.model';

export interface UpdateDrinkSubtypeInput {
  name?: string;
  translations?: Record<string, string>;
  defaultTempConsume?: number;
  defaultTempFreeze?: number;
}

export const useUpdateDrinkSubtype = () => {
  return useMutation({
    mutationFn: async ({
      id,
      drinkTypeId,
      updates,
    }: {
      id: string;
      drinkTypeId: string;
      updates: UpdateDrinkSubtypeInput;
    }): Promise<DrinkSubtype> => {
      return EndpointsDrinkSubtype.update(id, updates, drinkTypeId);
    },
  });
};
