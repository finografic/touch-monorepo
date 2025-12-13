import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { RegionLocale } from '@workspace/config/i18n.config';

// Query hooks
import { useCreateDrinkType, useUpdateDrinkType } from 'queries/drink-types';
import { useCreateVolume, useUpdateVolume } from 'queries/drink-volumes';
import { useCreateContainerType, useUpdateContainerType } from 'queries/container-types';

// Types and DTOs
import type { SectionKey, TranslationFormItem } from '../translations.types';
import { TranslationsDto } from '../translations.dto';

// Utilities
import { invalidateReferenceDataQueries } from 'queries/invalidateReferenceData';
import { useToast } from 'components/Toast/ToastContext';

/**
 * Clean, focused save orchestrator for product translations.
 *
 * Responsibilities:
 * - Diff items (temp-* = POST, existing = PATCH, missing = DELETE)
 * - Delegate to existing query hooks
 * - Invalidate caches
 * - NO state management, NO form logic
 *
 * @param sectionKey - Which section is being saved
 * @param supportedLanguages - Languages for DTO conversion
 */
export const useSaveProductTranslations = (sectionKey: SectionKey, supportedLanguages: RegionLocale[]) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ─────────────────────────────────────────────────────────────────────────
  // Mutation hooks (existing)
  // ─────────────────────────────────────────────────────────────────────────

  const createDrinkType = useCreateDrinkType();
  const updateDrinkType = useUpdateDrinkType();

  const createVolume = useCreateVolume();
  const updateVolume = useUpdateVolume();

  const createContainerType = useCreateContainerType();
  const updateContainerType = useUpdateContainerType();

  // TODO: Add delete hooks when created (soft delete via isActive: false)
  // const deleteDrinkType = useDeleteDrinkType();
  // const deleteVolume = useDeleteVolume();
  // const deleteContainerType = useDeleteContainerType();

  // ─────────────────────────────────────────────────────────────────────────
  // Main save logic
  // ─────────────────────────────────────────────────────────────────────────

  const save = useCallback(
    async (items: TranslationFormItem[], deletedIds?: string[]) => {
      try {
        // ⚠️ VALIDATION: Ensure we're working with CUIDs, not RHF's fieldId
        const invalidItems = items.filter(
          (item) =>
            !item.id || typeof item.id !== 'string' || (item.id.length < 10 && !item.id.startsWith('temp-')),
        );
        if (invalidItems.length > 0) {
          console.error('[useSaveProductTranslations] Invalid IDs detected:', invalidItems);
          throw new Error('Invalid item IDs - must be CUIDs or temp-* IDs');
        }

        const toCreate = items.filter((i) => i.id.startsWith('temp-'));
        const toUpdate = items.filter((i) => !i.id.startsWith('temp-') && !i.id.startsWith('temp_'));

        const createdItems: TranslationFormItem[] = [];
        let updateCount = 0;

        console.log('[useSaveProductTranslations] Processing:', {
          toCreate: toCreate.length,
          toUpdate: toUpdate.length,
        });

        // ───────────────────────────────────────────────────────────────────
        // 🔹 CREATE (temp-* IDs)
        // ───────────────────────────────────────────────────────────────────

        for (const item of toCreate) {
          const payload = TranslationsDto.toApi(item, supportedLanguages);

          let createdEntity: any;

          switch (sectionKey) {
            case 'drinkTypes':
              // Add required drinkType-specific fields
              createdEntity = await createDrinkType.mutateAsync({
                name: payload.name,
                translations: payload.translations,
                hasSubtypes: (item as any).hasSubtypes ?? false,
                defaultTempConsume: (item as any).defaultTempConsume ?? 5,
                defaultTempFreeze: (item as any).defaultTempFreeze ?? -2,
              });
              break;

            case 'volumes':
              // Add required volume-specific fields
              createdEntity = await createVolume.mutateAsync({
                name: payload.name,
                translations: payload.translations,
                valueInMl: (item as any).valueInMl ?? 330, // Default 330ml
                sortOrder: (item as any).sortOrder ?? 0,
                coolingFactor: (item as any).coolingFactor ?? 1,
              });
              break;

            case 'containerTypes':
              // Add required containerType-specific fields
              createdEntity = await createContainerType.mutateAsync({
                name: payload.name,
                translations: payload.translations,
                thermalConductivity: (item as any).thermalConductivity ?? 1.0,
              });
              break;

            case 'drinkSubtypes':
              throw new Error('drinkSubtypes not yet supported in this hook');

            default:
              throw new Error(`Unsupported section: ${sectionKey}`);
          }

          // Map temp ID → real CUID from server
          createdItems.push({
            ...item,
            id: createdEntity.id, // Replace temp-* with real CUID
          });
        }

        // ───────────────────────────────────────────────────────────────────
        // 🔹 UPDATE (existing CUIDs) - ONLY items that were changed
        // ───────────────────────────────────────────────────────────────────

        for (const item of toUpdate) {
          const payload = TranslationsDto.toApi(item, supportedLanguages);

          switch (sectionKey) {
            case 'drinkTypes':
              await updateDrinkType.mutateAsync({
                id: item.id,
                updates: {
                  translations: payload.translations,
                  hasSubtypes: (item as any).hasSubtypes,
                  defaultTempConsume: (item as any).defaultTempConsume,
                  defaultTempFreeze: (item as any).defaultTempFreeze,
                },
              });
              updateCount++;
              break;

            case 'volumes':
              await updateVolume.mutateAsync({
                id: item.id,
                updates: {
                  translations: payload.translations,
                  valueInMl: (item as any).valueInMl,
                  sortOrder: (item as any).sortOrder,
                  coolingFactor: (item as any).coolingFactor,
                },
              });
              updateCount++;
              break;

            case 'containerTypes':
              await updateContainerType.mutateAsync({
                id: item.id,
                updates: {
                  translations: payload.translations,
                  thermalConductivity: (item as any).thermalConductivity,
                },
              });
              updateCount++;
              break;

            case 'drinkSubtypes':
              throw new Error('drinkSubtypes not yet supported in this hook');

            default:
              throw new Error(`Unsupported section: ${sectionKey}`);
          }
        }

        // ───────────────────────────────────────────────────────────────────
        // ✅ Success feedback BEFORE refetch
        // ───────────────────────────────────────────────────────────────────

        const totalChanges = createdItems.length + updateCount;

        if (totalChanges > 0) {
          const parts: string[] = [];
          if (createdItems.length > 0) parts.push(`${createdItems.length} created`);
          if (updateCount > 0) parts.push(`${updateCount} updated`);

          toast({
            variant: 'success',
            message: `Saved: ${parts.join(', ')}`,
          });
        } else {
          toast({
            variant: 'info',
            message: 'No changes to save',
          });
        }

        // ───────────────────────────────────────────────────────────────────
        // 🔄 Invalidate caches and WAIT for refetch
        // ───────────────────────────────────────────────────────────────────

        // Aggressive invalidation of ALL reference data queries
        // This ensures admin dropdowns and frontend product flow reflect changes
        // AND triggers refetch in useProductTranslationData
        await invalidateReferenceDataQueries(queryClient);

        // ───────────────────────────────────────────────────────────────────
        // 🔁 Return saved items with real CUIDs for immediate form update
        // ───────────────────────────────────────────────────────────────────

        log('>>>', 'lime', {
          success: true,
          savedItems: [...createdItems, ...toUpdate],
        });

        return {
          success: true,
          savedItems: [...createdItems, ...toUpdate],
        };

        /*
        log('>>>', 'lime', {
          success: true,
          createdItems, // Items with real CUIDs replacing temp-* IDs
          updatedCount: updateCount,
          // Return items that were actually saved (with reconciled IDs)
          savedItems: [
            ...createdItems, // New items with real CUIDs
            ...toUpdate, // Existing items (unchanged IDs)
          ],
        });

        return {
          success: true,
          createdItems, // Items with real CUIDs replacing temp-* IDs
          updatedCount: updateCount,
          // Return items that were actually saved (with reconciled IDs)
          savedItems: [
            ...createdItems, // New items with real CUIDs
            ...toUpdate, // Existing items (unchanged IDs)
          ],
        };
        */
      } catch (error) {
        console.error('[useSaveProductTranslations] Error:', error);

        toast({
          variant: 'error',
          message: error instanceof Error ? error.message : 'Failed to save translations',
        });

        throw error;
      }
    },
    [
      sectionKey,
      supportedLanguages,
      queryClient,
      toast,
      createDrinkType,
      updateDrinkType,
      createVolume,
      updateVolume,
      createContainerType,
      updateContainerType,
    ],
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────────

  return {
    save,
    isLoading:
      createDrinkType.isPending ||
      updateDrinkType.isPending ||
      createVolume.isPending ||
      updateVolume.isPending ||
      createContainerType.isPending ||
      updateContainerType.isPending,
  };
};
