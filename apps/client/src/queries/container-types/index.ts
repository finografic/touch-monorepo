// ============================================================================
// QUERY KEYS
// ============================================================================
export const GET_CONTAINER_TYPES_QUERYKEY = ['get-container-types'] as const;
export const POST_CONTAINER_TYPE_QUERYKEY = ['post-container-type'] as const;
export const PATCH_CONTAINER_TYPE_QUERYKEY = ['patch-container-type'] as const;
export const DELETE_CONTAINER_TYPE_QUERYKEY = ['delete-container-type'] as const;

export { useCreateContainerType } from './useCreateContainerType';
export { useGetContainerType } from './useGetContainerType';
// ============================================================================
// HOOKS
// ============================================================================
export { useGetContainerTypes } from './useGetContainerTypes';
export { useUpdateContainerType } from './useUpdateContainerType';
