export const GET_MODES_QUERYKEY = ['get-modes'] as const;
export const GET_DEFAULT_MODE_QUERYKEY = ['get-default-mode'] as const;
export const UPDATE_DEFAULT_MODE_QUERYKEY = ['update-default-mode'] as const;
export const UPDATE_MODE_QUERYKEY = ['update-mode'] as const;
export const UPDATE_ACTIVE_STATES_QUERYKEY = ['update-active-states'] as const;

export { useGetDefaultMode } from './useGetDefaultMode';
export { useGetModes } from './useGetModes';
export { useUpdateActiveStates } from './useUpdateActiveStates';
export { useUpdateDefaultMode } from './useUpdateDefaultMode';
export { useUpdateMode } from './useUpdateMode';
