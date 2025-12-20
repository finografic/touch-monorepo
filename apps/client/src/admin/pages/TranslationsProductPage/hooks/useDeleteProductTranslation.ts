import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

// Types
import type { SectionKey } from '../translationsProduct.types';

// Utilities
import { invalidateReferenceDataQueries } from 'queries/invalidateReferenceData';
import { useToast } from 'components/Toast/ToastContext';

/**
 * Hook for immediate HARD deletion (DELETE from database)
 *
 * @param sectionKey - Which section the item belongs to
 */
export const useDeleteProductTranslation = (sectionKey: SectionKey) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteItem = useCallback(
    async (itemId: string, drinkTypeId?: string) => {
      try {
        console.log(`[useDeleteProductTranslation] Deleting ${sectionKey}:${itemId}`);

        // HARD DELETE - remove from database
        switch (sectionKey) {
          case 'drinkTypes':
            await api.delete(`/drink-types/${itemId}`);
            break;

          case 'volumes':
            await api.delete(`/drink-volumes/${itemId}`);
            break;

          case 'containerTypes':
            await api.delete(`/container-types/${itemId}`);
            break;

          case 'drinkSubtypes':
            if (!drinkTypeId) {
              throw new Error('drinkTypeId is required to delete drink subtypes');
            }
            await api.delete(`/drink-types/${drinkTypeId}/subtypes/${itemId}`);
            break;

          default:
            throw new Error(`Unsupported section: ${sectionKey}`);
        }

        // Aggressive invalidation to ensure all UIs update
        await invalidateReferenceDataQueries(queryClient);

        toast({
          variant: 'success',
          message: 'Item deleted',
        });

        return {
          success: true,
          deletedId: itemId,
        };
      } catch (error) {
        console.error('[useDeleteProductTranslation] Error:', error);

        toast({
          variant: 'error',
          message: error instanceof Error ? error.message : 'Failed to delete item',
        });

        throw error; // Re-throw so caller knows it failed
      }
    },
    [sectionKey, queryClient, toast],
  );

  return {
    deleteItem,
    isDeleting: false, // We don't track pending state for direct API calls
  };
};
