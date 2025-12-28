import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type DrinkTypeUpdate, EndpointsDrinkType } from 'api/endpoints';

import type { DrinkType } from 'types/models/drink-type.model';
import { GET_DRINK_TYPES_TRANSLATIONS_QUERYKEY } from '.';

export const useUpdateDrinkTypeTranslations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: DrinkTypeUpdate }) =>
      EndpointsDrinkType.update(id, updates),
    onSuccess: (updatedDrinkType) => {
      queryClient.setQueryData<DrinkType[]>(GET_DRINK_TYPES_TRANSLATIONS_QUERYKEY, (oldData) => {
        if (!oldData) return [updatedDrinkType];
        return oldData.map((item) => (item.id === updatedDrinkType.id ? updatedDrinkType : item));
      });
    },
  });
};
