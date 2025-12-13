export const GET_DRINK_VOLUMES_QUERYKEY = ['get-drink-volumes'] as const;
export const POST_DRINK_VOLUME_QUERYKEY = ['post-drink-volume'] as const;
export const PATCH_DRINK_VOLUME_QUERYKEY = ['patch-drink-volume'] as const;
export const DELETE_DRINK_VOLUME_QUERYKEY = ['delete-drink-volume'] as const;

export { useCreateVolume } from './useCreateVolume';
export { useUpdateVolume } from './useUpdateVolume';
export { useGetDrinkVolumes } from './useGetDrinkVolumes';
