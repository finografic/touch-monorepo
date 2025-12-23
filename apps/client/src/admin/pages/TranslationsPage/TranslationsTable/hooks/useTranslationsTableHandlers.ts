import { useCallback } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { TranslationsFormItem } from '../../../TranslationsSHARED/translations.types';
import { encodeRHFKey, decodeRHFKey } from 'admin/utils/languages.utils';

// Form structure: { items: { [key: string]: TranslationsFormItem } }
type TranslationsFormData = {
  items: Record<string, TranslationsFormItem>;
};

interface UseTranslationsTableHandlersOptions {
  methods: UseFormReturn<TranslationsFormData>;
  watchedItems: Record<string, TranslationsFormItem>;
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
      const item = watchedItems[key];
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

    // Convert object to array for processing
    // Keys in data.items are encoded, but items themselves have the real keys
    const itemsArray = Object.values(data.items);

    // 1. Remove empty rows
    const nonEmptyItems = itemsArray.filter((item) => !isItemEmpty(item));

    // 2. Keep only dirty or new rows
    // dirtyFields.items keys are encoded (RHF format), so we need to encode item keys for comparison
    const changedItems = nonEmptyItems.filter((item) => {
      if (item.id.startsWith('temp-')) return true;
      const itemKey = item.key || item.id;
      const encodedKey = encodeRHFKey(itemKey);
      return Boolean(dirtyFields.items?.[encodedKey]);
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
