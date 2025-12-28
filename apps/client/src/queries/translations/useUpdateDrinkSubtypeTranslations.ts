import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type DrinkSubtypeUpdate, EndpointsDrinkSubtype } from 'api/endpoints';

import type { DrinkSubtype } from 'types/models/drink-type.model';
import { GET_DRINK_SUBTYPES_TRANSLATIONS_QUERYKEY } from '.';

export const useUpdateDrinkSubtypeTranslations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
      drinkTypeId,
    }: {
      id: string;
      updates: DrinkSubtypeUpdate;
      drinkTypeId: string;
    }) => EndpointsDrinkSubtype.update(id, updates, drinkTypeId),
    onSuccess: (updatedSubtype) => {
      queryClient.setQueryData<DrinkSubtype[]>(GET_DRINK_SUBTYPES_TRANSLATIONS_QUERYKEY, (oldData) => {
        if (!oldData) return [updatedSubtype];
        return oldData.map((item) => (item.id === updatedSubtype.id ? updatedSubtype : item));
      });
    },
  });
};
