export const GET_DRINK_TYPES_QUERYKEY = ['get-drink-types'] as const;
export const POST_DRINK_TYPE_QUERYKEY = ['post-drink-type'] as const;
export const PATCH_DRINK_TYPE_QUERYKEY = ['patch-drink-type'] as const;
export const DELETE_DRINK_TYPE_QUERYKEY = ['delete-drink-type'] as const;

export const GET_DRINK_SUBTYPES_QUERYKEY = ['get-drink-subtypes'] as const;
export const POST_DRINK_SUBTYPE_QUERYKEY = ['post-drink-subtype'] as const;
export const PATCH_DRINK_SUBTYPE_QUERYKEY = ['patch-drink-subtype'] as const;
export const DELETE_DRINK_SUBTYPE_QUERYKEY = ['delete-drink-subtype'] as const;

export { useCreateDrinkSubtype } from './useCreateDrinkSubtype';
export { useCreateDrinkType } from './useCreateDrinkType';
export { useGetDrinkSubtypes } from './useGetDrinkSubtypes';
export { useGetDrinkType } from './useGetDrinkType';
export { useGetDrinkTypes } from './useGetDrinkTypes';
export { useUpdateDrinkSubtype } from './useUpdateDrinkSubtype';
export { useUpdateDrinkType } from './useUpdateDrinkType';
