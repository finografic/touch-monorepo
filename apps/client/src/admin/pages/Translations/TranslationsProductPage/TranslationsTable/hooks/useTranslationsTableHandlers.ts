import { type MutableRefObject, useCallback } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import type { TranslationsFormItem } from '../../translationsProduct.types';

interface UseTranslationsTableHandlersOptions {
  methods: UseFormReturn<{ items: TranslationsFormItem[] }>;
  watchedItems: TranslationsFormItem[];
  remove: (index: number) => void;
  languageKeys: string[];
  isItemEmpty: (item: TranslationsFormItem) => boolean;
  onSave?: ({ items }: { items: TranslationsFormItem[] }) => Promise<{ savedItems: TranslationsFormItem[] }>;
  onDelete?: (itemId: string, drinkTypeId?: string) => Promise<{ success: boolean; deletedId: string }>;
  initialItemsRef: MutableRefObject<TranslationsFormItem[]>;
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
      // eslint-disable-next-line no-alert
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

  /**
   * Build a comparable snapshot of fields we send to the API for this item.
   * Used to exclude existing rows that RHF marked dirty but are unchanged.
   * Normalizes numbers so 12 and "12" compare equal (avoids sending unchanged
   * rows that only differ by type after refetch/form state).
   */
  const getComparablePayload = useCallback(
    (item: TranslationsFormItem) => {
      const base: Record<string, unknown> = {
        name: String(item.name ?? ''),
        ...Object.fromEntries(
          languageKeys.map((k) => [k, String(item[k as keyof TranslationsFormItem] ?? '')]),
        ),
      };
      if ((item as any).drinkTypeId != null) {
        const consume = (item as any).defaultTempConsume;
        const freeze = (item as any).defaultTempFreeze;
        base.defaultTempConsume = consume === undefined || consume === null ? undefined : Number(consume);
        base.defaultTempFreeze = freeze === undefined || freeze === null ? undefined : Number(freeze);
      }
      return JSON.stringify(base);
    },
    [languageKeys],
  );

  const handleSave = methods.handleSubmit(async (data) => {
    const { dirtyFields } = methods.formState;
    const initial = initialItemsRef.current;

    // 1. Remove empty rows, keeping original index for dirty check
    const withIndex = data.items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !isItemEmpty(item));

    // 2. Keep only dirty or new (temp) rows — use ORIGINAL index for dirtyFields
    const dirtyOrNew = withIndex.filter(
      ({ item, index }) => item.id.startsWith('temp-') || Boolean(dirtyFields.items?.[index]),
    );

    // 3. For existing (non-temp) rows, only include if actually changed from initial.
    //    RHF can mark rows dirty incorrectly (e.g. after append); sending them causes
    //    wrong-type PATCH (e.g. Vino) and validation errors (e.g. defaultTempFreeze).
    const changedItems = dirtyOrNew
      .filter(({ item }) => {
        if (item.id.startsWith('temp-')) return true;
        const initialItem = initial.find((i) => i.id === item.id);
        if (!initialItem) return true;
        return getComparablePayload(item) !== getComparablePayload(initialItem);
      })
      .map(({ item }) => item);

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
