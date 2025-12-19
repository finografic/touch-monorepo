import { useCallback } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { api } from 'api';
import { transformFetchError } from '@workspace/core/api';

import { useToast } from 'components/Toast/ToastContext';
import type { TranslationDomain } from './useGetTranslations';

/**
 * Hook for immediate HARD deletion (DELETE from database)
 */
export const useDeleteTranslations = ({ domain }: { domain: TranslationDomain }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete<void>(`/translations/${domain}/${id}`);
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
