import { useCallback } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { TranslationsFormItem } from '../../../Translations/types/translations.types';

// Form structure: { items: TranslationsFormItem[] }
type TranslationsFormData = {
  items: TranslationsFormItem[];
};

interface UseTranslationsTableHandlersOptions {
  methods: UseFormReturn<TranslationsFormData>;
  watchedItems: TranslationsFormItem[];
  remove: (key: string) => void;
  languageKeys: string[];
  isItemEmpty: (item: TranslationsFormItem) => boolean;
  onSave?: ({ items }: { items: TranslationsFormItem[] }) => Promise<{ savedItems: TranslationsFormItem[] }>;
  onDelete?: (itemId: string) => Promise<{ success: boolean; deletedId: string }>;
  initialItemsRef: React.MutableRefObject<TranslationsFormItem[]>;
}

interface UseTranslationsTableHandlersReturn {
  handleDelete: (key: string) => Promise<void>;
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
    async (key: string) => {
      // Find item by key (could be translation key or id)
      const item = watchedItems.find((item) => item.key === key || item.id === key);
      if (!item) return;

      // If it's a temp item (not saved yet), just remove from form
      if (item.id.startsWith('temp-')) {
        remove(key);
        return;
      }

      const itemKey = item.key || 'this item';
      const confirmed = window.confirm(
        `Are you sure you want to delete "${itemKey}"?\n\nThis action cannot be undone.`,
      );

      if (!confirmed) return;

      if (!onDelete) {
        remove(key);
        return;
      }

      try {
        const result = await onDelete(item.id);

        if (result?.success) {
          remove(key);
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

    // data.items is already an array
    const itemsArray = data.items;

    // 1. Remove empty rows
    const nonEmptyItems = itemsArray.filter((item) => !isItemEmpty(item));

    // 2. Keep only dirty or new rows
    // dirtyFields.items is an array, so we check by index
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
