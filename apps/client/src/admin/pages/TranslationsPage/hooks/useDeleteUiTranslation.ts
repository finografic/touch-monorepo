import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useDeleteTranslationUi } from 'queries/translations-ui';
import { GET_TRANSLATIONS_UI_QUERYKEY } from 'queries/translations-ui';

import { useToast } from 'components/Toast/ToastContext';

/**
 * Hook for immediate HARD deletion (DELETE from database)
 */
export const useDeleteUiTranslation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deleteTranslationUi = useDeleteTranslationUi();

  const deleteItem = useCallback(
    async (itemId: string) => {
      try {
        console.log(`[useDeleteUiTranslation] Deleting translation: ${itemId}`);

        // HARD DELETE - remove from database
        await deleteTranslationUi.mutateAsync(itemId);

        // Invalidate translations UI queries
        await queryClient.invalidateQueries({
          queryKey: GET_TRANSLATIONS_UI_QUERYKEY,
        });

        toast({
          variant: 'success',
          message: 'Translation deleted',
        });

        return {
          success: true,
          deletedId: itemId,
        };
      } catch (error) {
        console.error('[useDeleteUiTranslation] Error:', error);

        toast({
          variant: 'error',
          message: error instanceof Error ? error.message : 'Failed to delete translation',
        });

        throw error; // Re-throw so caller knows it failed
      }
    },
    [deleteTranslationUi, queryClient, toast],
  );

  return {
    deleteItem,
    isDeleting: deleteTranslationUi.isPending,
  };
};

