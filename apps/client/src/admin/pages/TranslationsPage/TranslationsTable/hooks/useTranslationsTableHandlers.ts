import { useCallback } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { TranslationFormItem } from '../../translations.types';

interface UseTranslationsTableHandlersOptions {
  methods: UseFormReturn<{ items: TranslationFormItem[] }>;
  watchedItems: TranslationFormItem[];
  remove: (index: number) => void;
  languageKeys: string[];
  isItemEmpty: (item: TranslationFormItem) => boolean;
  onSave?: ({ items }: { items: TranslationFormItem[] }) => Promise<{ savedItems: TranslationFormItem[] }>;
  onDelete?: (itemId: string, drinkTypeId?: string) => Promise<{ success: boolean; deletedId: string }>;
  initialItemsRef: React.MutableRefObject<TranslationFormItem[]>;
}

interface UseTranslationsTableHandlersReturn {
  handleDelete: (index: number) => Promise<void>;
  handleSave: () => Promise<void>;
  handleReset: () => void;
}

/**
 * Shared handlers for delete, save, and reset operations
 * Used by both TranslationsTable and TranslationsTableExpandable
 */
export const useTranslationsTableHandlers = ({
  methods,
  watchedItems,
  remove,
  languageKeys,
  isItemEmpty,
  onSave,
  onDelete,
  initialItemsRef,
}: UseTranslationsTableHandlersOptions): UseTranslationsTableHandlersReturn => {
  // ======================================================================== //
  // Delete Handler
  // ======================================================================== //

  const handleDelete = useCallback(
    async (index: number) => {
      const item = watchedItems[index];

      // If it's a temp item (not saved yet), just remove from form
      if (item.id.startsWith('temp-')) {
        remove(index);
        return;
      }

      const itemName = item.name || 'this item';
      const confirmed = window.confirm(
        `Are you sure you want to delete "${itemName}"?\n\nThis action cannot be undone.`,
      );

      if (!confirmed) return;

      if (!onDelete) {
        remove(index);
        return;
      }

      try {
        // For expandable table, drinkTypeId is passed; for regular table, it's undefined
        const drinkTypeId = (item as any).drinkTypeId;
        const result = await onDelete(item.id, drinkTypeId);

        if (result?.success) {
          remove(index);
          // Update initial tracking to reflect deletion
          initialItemsRef.current = initialItemsRef.current.filter((i) => i.id !== result.deletedId);
        }
      } catch (error) {
        console.error('[Delete] Failed:', error);
        // UI remains unchanged on failure
      }
    },
    [watchedItems, remove, onDelete, initialItemsRef],
  );

  // ======================================================================== //
  // Save Handler
  // ======================================================================== //

  const handleSave = methods.handleSubmit(async (data) => {
    const { dirtyFields } = methods.formState;

    // 1. Remove empty rows
    const nonEmptyItems = data.items.filter((item) => !isItemEmpty(item));

    // 2. Keep only dirty or new rows
    const changedItems = nonEmptyItems.filter((item, index) => {
      if (item.id.startsWith('temp-')) return true;
      return Boolean(dirtyFields.items?.[index]);
    });

    if (changedItems.length === 0) return;

    await onSave?.({ items: changedItems });

    // Don't reset here - let the refetch from invalidateReferenceDataQueries
    // update the items prop, which will trigger the reset in the useEffect above
    // This ensures we always reset with the FULL dataset from the server
  });

  // ======================================================================== //
  // Reset Handler
  // ======================================================================== //

  const handleReset = useCallback(() => {
    methods.reset();
  }, [methods]);

  return {
    handleDelete,
    handleSave,
    handleReset,
  };
};
