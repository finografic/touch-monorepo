// ============================================================================
// QUERY KEYS
// ============================================================================
export const GET_TRANSLATIONS_UI_QUERYKEY = ['get-translations-ui'] as const;
export const POST_TRANSLATIONS_UI_QUERYKEY = ['post-translations-ui'] as const;
export const PATCH_TRANSLATIONS_UI_QUERYKEY = ['patch-translations-ui'] as const;
export const DELETE_TRANSLATIONS_UI_QUERYKEY = ['delete-translations-ui'] as const;

// ============================================================================
// HOOKS
// ============================================================================
export { useGetTranslationsUi } from './useGetTranslationsUi';
export { useGetTranslationUi } from './useGetTranslationUi';
export { useCreateTranslationUi } from './useCreateTranslationUi';
export { useUpdateTranslationUi } from './useUpdateTranslationUi';
export { useDeleteTranslationUi } from './useDeleteTranslationUi';

// ============================================================================
// TYPES (re-exported from endpoints for convenience)
// ============================================================================
export type { CreateTranslationUiInput, UpdateTranslationUiInput } from 'api/endpoints';
