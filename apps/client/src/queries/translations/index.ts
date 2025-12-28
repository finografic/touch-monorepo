// ============================================================================
// QUERY KEYS
// ============================================================================
export const GET_DRINK_TYPES_TRANSLATIONS_QUERYKEY = ['translations', 'drinkTypes'] as const;
export const GET_DRINK_SUBTYPES_TRANSLATIONS_QUERYKEY = ['translations', 'drinkSubtypes'] as const;
export const GET_VOLUMES_TRANSLATIONS_QUERYKEY = ['translations', 'volumes'] as const;
export const GET_CONTAINER_TYPES_TRANSLATIONS_QUERYKEY = ['translations', 'containerTypes'] as const;
export const GET_ALL_TRANSLATIONS_QUERYKEY = ['translations'] as const;
export const GET_TRANSLATIONS_QUERYKEY = ['translations'] as const;

export const PATCH_DRINK_TYPE_TRANSLATIONS_QUERYKEY = ['patch-drink-type-translations'] as const;
export const PATCH_DRINK_SUBTYPE_TRANSLATIONS_QUERYKEY = ['patch-drink-subtype-translations'] as const;
export const PATCH_VOLUME_TRANSLATIONS_QUERYKEY = ['patch-volume-translations'] as const;
export const PATCH_CONTAINER_TYPE_TRANSLATIONS_QUERYKEY = ['patch-container-type-translations'] as const;
export const BATCH_UPDATE_TRANSLATIONS_QUERYKEY = ['batch-update-translations'] as const;

export { useBatchUpdateTranslations } from './useBatchUpdateTranslations';
export { useGetAllTranslations } from './useGetAllTranslations';
export { useGetContainerTypesTranslations } from './useGetContainerTypesTranslations';
export { useGetDrinkSubtypesTranslations } from './useGetDrinkSubtypesTranslations';
// ============================================================================
// HOOKS
// ============================================================================
export { useGetDrinkTypesTranslations } from './useGetDrinkTypesTranslations';
export { useGetVolumesTranslations } from './useGetVolumesTranslations';
export { useUpdateContainerTypeTranslations } from './useUpdateContainerTypeTranslations';
export { useUpdateDrinkSubtypeTranslations } from './useUpdateDrinkSubtypeTranslations';
export { useUpdateDrinkTypeTranslations } from './useUpdateDrinkTypeTranslations';
export { useUpdateVolumeTranslations } from './useUpdateVolumeTranslations';

// ============================================================================
// TYPES (re-exported from endpoints for convenience)
// ============================================================================
export type {
  ContainerType,
  DrinkSubtypeTranslation,
  DrinkSubtypeUpdate,
  DrinkTypeTranslation,
  DrinkTypeUpdate,
  UpdateContainerTypeInput,
  VolumeTranslation,
  VolumeUpdate,
} from 'api/endpoints';
