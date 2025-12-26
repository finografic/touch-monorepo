import { useMutation } from '@tanstack/react-query';

import { EndpointsDrinkType, type DrinkTypeUpdate } from 'api/endpoints';
import type { DrinkType } from 'types/models/drink-type.model';

export interface UpdateDrinkTypeInput {
  name?: string;
  hasSubtypes?: boolean;
  defaultTempConsume?: number;
  defaultTempFreeze?: number;
  translations?: Record<string, string>;
}

export const useUpdateDrinkType = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateDrinkTypeInput;
    }): Promise<DrinkType> => {
      return EndpointsDrinkType.update(id, updates);
    },
  });
};
