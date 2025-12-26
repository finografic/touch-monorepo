import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EndpointsDrinkType, type DrinkTypeTranslation, type DrinkTypeUpdate } from 'api/endpoints';
import { GET_DRINK_TYPES_TRANSLATIONS_QUERYKEY } from '.';

/**
 * Update drink type translations
 */
export const useUpdateDrinkTypeTranslations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: DrinkTypeUpdate }) =>
      EndpointsDrinkType.updateDrinkType(id, updates),
    onSuccess: (updatedDrinkType) => {
      // Update the cache with the new data
      queryClient.setQueryData<DrinkTypeTranslation[]>(GET_DRINK_TYPES_TRANSLATIONS_QUERYKEY, (oldData) => {
        if (!oldData) return [updatedDrinkType];
        return oldData.map((item) => (item.id === updatedDrinkType.id ? updatedDrinkType : item));
      });
    },
  });
};
