import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EndpointsDrinkSubtype, type DrinkSubtypeTranslation, type DrinkSubtypeUpdate } from 'api/endpoints';
import { GET_DRINK_SUBTYPES_TRANSLATIONS_QUERYKEY } from '.';

/**
 * Update drink subtype translations
 */
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
    }) => EndpointsDrinkSubtype.updateDrinkSubtype(id, updates, drinkTypeId),
    onSuccess: (updatedSubtype) => {
      // Update the cache with the new data
      queryClient.setQueryData<DrinkSubtypeTranslation[]>(
        GET_DRINK_SUBTYPES_TRANSLATIONS_QUERYKEY,
        (oldData) => {
          if (!oldData) return [updatedSubtype];
          return oldData.map((item) => (item.id === updatedSubtype.id ? updatedSubtype : item));
        },
      );
    },
  });
};
