export const GET_TRANSLATIONS_UI_QUERYKEY = ['get-translations-ui'] as const;
export const POST_TRANSLATIONS_UI_QUERYKEY = ['post-translations-ui'] as const;
export const PATCH_TRANSLATIONS_UI_QUERYKEY = ['patch-translations-ui'] as const;
export const DELETE_TRANSLATIONS_UI_QUERYKEY = ['delete-translations-ui'] as const;

export { useCreateTranslationUi } from './useCreateTranslationUi';
export { useUpdateTranslationUi } from './useUpdateTranslationUi';
export { useGetTranslationUi } from './useGetTranslationUi';
export { useGetTranslationsUi } from './useGetTranslationsUi';
export { useDeleteTranslationUi } from './useDeleteTranslationUi';
