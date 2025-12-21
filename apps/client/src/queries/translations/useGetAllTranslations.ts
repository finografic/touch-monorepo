import { useGetDrinkTypesTranslations } from './useGetDrinkTypesTranslations';
import { useGetDrinkSubtypesTranslations } from './useGetDrinkSubtypesTranslations';
import { useGetVolumesTranslations } from './useGetVolumesTranslations';
import { useGetContainerTypesTranslations } from './useGetContainerTypesTranslations';

/**
 * Get all translation data at once
 */
export const useGetAllTranslations = () => {
  const drinkTypesQuery = useGetDrinkTypesTranslations();
  const drinkSubtypesQuery = useGetDrinkSubtypesTranslations();
  const volumesQuery = useGetVolumesTranslations();
  const containerTypesQuery = useGetContainerTypesTranslations();

  return {
    data: {
      drinkTypes: drinkTypesQuery.data || [],
      drinkSubtypes: drinkSubtypesQuery.data || [],
      volumes: volumesQuery.data || [],
      containerTypes: containerTypesQuery.data || [],
    },
    isLoading:
      drinkTypesQuery.isLoading ||
      drinkSubtypesQuery.isLoading ||
      volumesQuery.isLoading ||
      containerTypesQuery.isLoading,
    isError:
      drinkTypesQuery.isError ||
      drinkSubtypesQuery.isError ||
      volumesQuery.isError ||
      containerTypesQuery.isError,
    error:
      drinkTypesQuery.error ||
      drinkSubtypesQuery.error ||
      volumesQuery.error ||
      containerTypesQuery.error,
    refetch: () => {
      drinkTypesQuery.refetch();
      drinkSubtypesQuery.refetch();
      volumesQuery.refetch();
      containerTypesQuery.refetch();
    },
  };
};

