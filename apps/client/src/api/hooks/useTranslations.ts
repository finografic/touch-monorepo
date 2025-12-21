import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ADMIN_DATA_QUERY_CONFIG } from 'config/api';
import type {
  ContainerTypeTranslation,
  ContainerTypeUpdate,
  DrinkSubtypeTranslation,
  DrinkSubtypeUpdate,
  DrinkTypeTranslation,
  DrinkTypeUpdate,
  VolumeTranslation,
  VolumeUpdate,
} from '../endpoints';
// import { translationEndpoints } from '../endpoints';
import {
  containerTypesEndpoints,
  drinkSubtypeEndpoints,
  drinkTypeEndpoints,
  volumeEndpoints,
} from '../endpoints';
import { batchTranslationEndpoints } from '../batch/batch-translations';

// Query keys for caching
export const TRANSLATION_QUERY_KEYS = {
  drinkTypes: ['translations', 'drinkTypes'] as const,
  drinkSubtypes: ['translations', 'drinkSubtypes'] as const,
  volumes: ['translations', 'volumes'] as const,
  containerTypes: ['translations', 'containerTypes'] as const,
  all: ['translations'] as const,
} as const;

/**
 * Hook to fetch all drink types for translation
 */
export const useGetDrinkTypes = () => {
  return useQuery({
    queryKey: [...TRANSLATION_QUERY_KEYS.drinkTypes],
    queryFn: drinkTypeEndpoints.getDrinkTypes,
    ...ADMIN_DATA_QUERY_CONFIG, // Use admin config for fresh data in dev
  });
};

/**
 * Hook to fetch all drink subtypes for translation
 */
export const useGetDrinkSubtypes = () => {
  return useQuery({
    queryKey: [...TRANSLATION_QUERY_KEYS.drinkSubtypes],
    queryFn: drinkSubtypeEndpoints.getDrinkSubtypes,
    ...ADMIN_DATA_QUERY_CONFIG, // Use admin config for fresh data in dev
  });
};

/**
 * Hook to fetch all volumes for translation
 */
export const useGetVolumes = () => {
  return useQuery({
    queryKey: [...TRANSLATION_QUERY_KEYS.volumes],
    queryFn: volumeEndpoints.getVolumes,
    ...ADMIN_DATA_QUERY_CONFIG, // Use admin config for fresh data in dev
  });
};

/**
 * Hook to fetch all container types for translation
 */
export const useGetContainerTypes = () => {
  return useQuery({
    queryKey: [...TRANSLATION_QUERY_KEYS.containerTypes],
    queryFn: containerTypesEndpoints.getAll,
    ...ADMIN_DATA_QUERY_CONFIG, // Use admin config for fresh data in dev
  });
};

/**
 * Hook to fetch all translation data at once
 */
export const useGetAllTranslations = () => {
  const drinkTypesQuery = useGetDrinkTypes();
  const drinkSubtypesQuery = useGetDrinkSubtypes();
  const volumesQuery = useGetVolumes();
  const containerTypesQuery = useGetContainerTypes();

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
      drinkTypesQuery.error || drinkSubtypesQuery.error || volumesQuery.error || containerTypesQuery.error,
    refetch: () => {
      drinkTypesQuery.refetch();
      drinkSubtypesQuery.refetch();
      volumesQuery.refetch();
      containerTypesQuery.refetch();
    },
  };
};

/**
 * Hook to update drink type translations
 */
export const useUpdateDrinkType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: DrinkTypeUpdate }) =>
      drinkTypeEndpoints.updateDrinkType(id, updates),
    onSuccess: (updatedDrinkType) => {
      // Update the cache with the new data
      queryClient.setQueryData<DrinkTypeTranslation[]>(TRANSLATION_QUERY_KEYS.drinkTypes, (oldData) => {
        if (!oldData) return [updatedDrinkType];
        return oldData.map((item) => (item.id === updatedDrinkType.id ? updatedDrinkType : item));
      });
    },
  });
};

/**
 * Hook to update drink subtype translations
 */
export const useUpdateDrinkSubtype = () => {
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
    }) => drinkSubtypeEndpoints.updateDrinkSubtype(id, updates, drinkTypeId),
    onSuccess: (updatedSubtype) => {
      // Update the cache with the new data
      queryClient.setQueryData<DrinkSubtypeTranslation[]>(TRANSLATION_QUERY_KEYS.drinkSubtypes, (oldData) => {
        if (!oldData) return [updatedSubtype];
        return oldData.map((item) => (item.id === updatedSubtype.id ? updatedSubtype : item));
      });
    },
  });
};

/**
 * Hook to update volume translations
 */
export const useUpdateVolume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: VolumeUpdate }) =>
      volumeEndpoints.updateVolume(id, updates),
    onSuccess: (updatedVolume) => {
      // Update the cache with the new data
      queryClient.setQueryData<VolumeTranslation[]>(TRANSLATION_QUERY_KEYS.volumes, (oldData) => {
        if (!oldData) return [updatedVolume];
        return oldData.map((item) => (item.id === updatedVolume.id ? updatedVolume : item));
      });
    },
  });
};

/**
 * Hook to update container type translations
 */
export const useUpdateContainerType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ContainerType }) =>
      containerTypesEndpoints.update(id, updates),
    onSuccess: (updatedContainerType) => {
      // Update the cache with the new data
      queryClient.setQueryData<ContainerType[]>(TRANSLATION_QUERY_KEYS.containerTypes, (oldData) => {
        if (!oldData) return [updatedContainerType];
        return oldData.map((item) => (item.id === updatedContainerType.id ? updatedContainerType : item));
      });
    },
  });
};

/**
 * Hook to batch update all translations
 */
export const useBatchUpdateTranslations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: batchTranslationEndpoints.batchUpdateTranslations,
    onSuccess: () => {
      // Invalidate all translation queries to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: TRANSLATION_QUERY_KEYS.all,
      });
    },
  });
};
