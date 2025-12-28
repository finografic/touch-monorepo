import { useCallback } from 'react';
import { transformFetchError } from '@workspace/core/api';
import type { I18nTranslationsDomain } from '@workspace/i18n/types';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';
import { useToast } from 'components/Toast/ToastContext';

/**
 * Hook for immediate HARD deletion (DELETE from database)
 */
export const useDeleteTranslations = ({ domain }: { domain: I18nTranslationsDomain }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await api.delete<void>(`/translations/${domain}/${id}`);
      } catch (error) {
        throw transformFetchError(error);
      }
    },
  });

  const deleteItem = useCallback(
    async (itemId: string) => {
      try {
        console.log(`[useDeleteTranslations] Deleting translation: ${itemId}`);

        // HARD DELETE - remove from database
        await deleteMutation.mutateAsync(itemId);

        // Invalidate translations queries
        await queryClient.invalidateQueries({
          // queryKey: GET_TRANSLATIONS_UI_QUERYKEY,
          queryKey: [`translations-${domain}`],
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
        console.error('[useDeleteTranslations] Error:', error);

        toast({
          variant: 'error',
          message: error instanceof Error ? error.message : 'Failed to delete translation',
        });

        throw error; // Re-throw so caller knows it failed
      }
    },
    [domain, deleteMutation, queryClient, toast],
  );

  return {
    deleteItem,
    isDeleting: deleteMutation.isPending,
  };
};
