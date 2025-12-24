import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import type { RegionLocale } from '@workspace/config/i18n.config';
import type { TranslationsFormItem } from '../../../TranslationsSHARED/translations.types';
import {
  getLanguageKeys,
  isItemEmpty as isItemEmptyUtil,
} from '../../../TranslationsSHARED/utils/translationsTable.utils';

interface UseTranslationsTableFormOptions {
  items: TranslationsFormItem[];
  supportedLanguages: RegionLocale[];
}

// Form structure: { items: TranslationsFormItem[] }
type TranslationsFormData = {
  items: TranslationsFormItem[];
};

interface UseTranslationsTableFormReturn {
  methods: UseFormReturn<TranslationsFormData>;
  fields: ReturnType<typeof useFieldArray<TranslationsFormData, 'items'>>['fields'];
  remove: (key: string) => void; // Still accepts key, finds index internally
  append: (item: TranslationsFormItem) => void;
  watchedItems: TranslationsFormItem[];
  languageKeys: string[];
  hasEmptyRow: boolean;
  isDirtyLastItem: boolean;
  isItemEmpty: (item: TranslationsFormItem) => boolean;
}

/**
 * Shared hook for RHF form setup, reset logic, and empty row detection
 * Uses array indices with useFieldArray (same pattern as TranslationsProductPage)
 */
export const useTranslationsTableForm = ({
  items,
  supportedLanguages,
}: UseTranslationsTableFormOptions): UseTranslationsTableFormReturn => {
  // ======================================================================== //
  // RHF Setup
  // ======================================================================== //

  const methods = useForm<TranslationsFormData>({
    mode: 'onChange',
    defaultValues: { items },
  });

  const { control, watch } = methods;

  const {
    fields,
    remove: removeByIndex,
    append: appendItem,
  } = useFieldArray({
    control,
    name: 'items',
    keyName: 'fieldId', // 🔑 CRITICAL: RHF uses 'fieldId' for tracking, we keep 'id' for our CUID
  });

  const watchedItems = watch('items'); // Already an array!

  // ======================================================================== //
  // Remove by Key (finds index and removes)
  // ======================================================================== //

  const remove = useCallback(
    (key: string) => {
      const index = watchedItems.findIndex((item) => item.key === key || item.id === key);
      if (index !== -1) {
        removeByIndex(index);
      }
    },
    [watchedItems, removeByIndex],
  );

  // ======================================================================== //
  // Append (simple - just append to array)
  // ======================================================================== //

  const append = useCallback(
    (item: TranslationsFormItem) => {
      appendItem(item);
    },
    [appendItem],
  );

  // ======================================================================== //
  // Form Reset Logic
  // ======================================================================== //

  const isInitialMount = useRef(true);
  const prevItemsRef = useRef<TranslationsFormItem[]>(items);

  // Reset form when items prop changes (after refetch from invalidation)
  // This ensures form stays in sync with server data after save/delete
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevItemsRef.current = items;
      return; // Skip reset on initial mount
    }

    // Check if items actually changed by comparing lengths and IDs/keys
    // This is more reliable than JSON.stringify for detecting real changes
    const itemsChanged =
      prevItemsRef.current.length !== items.length ||
      items.some((item, index) => {
        const prevItem = prevItemsRef.current[index];
        if (!prevItem) return true;
        // Check if ID or key changed, or if any translation value changed
        if (prevItem.id !== item.id || prevItem.key !== item.key) return true;
        // Check if any translation values changed
        const langKeys = Object.keys(item).filter((k) => k !== 'id' && k !== 'key');
        return langKeys.some((k) => prevItem[k] !== item[k]);
      });

    if (itemsChanged) {
      // Reset with full items array from refetch
      // ⚠️ keepDefaultValues: false is CRITICAL - updates defaultValues to new items
      // Otherwise, form compares against old defaults and everything appears dirty
      methods.reset({ items }, { keepValues: false, keepDefaultValues: false, keepDirty: false });
      prevItemsRef.current = items;
    }
  }, [items, methods]);

  // ======================================================================== //
  // Empty Row Detection
  // ======================================================================== //

  const languageKeys = useMemo(() => getLanguageKeys(supportedLanguages), [supportedLanguages]);

  // Get items as array for checking last item
  const isDirtyLastItem = watchedItems.length === 0 || Boolean(watchedItems.at(-1)?.key);

  // Helper: check if item is empty (all language fields empty)
  const isItemEmpty = useCallback(
    (item: TranslationsFormItem): boolean => {
      return isItemEmptyUtil(item, languageKeys);
    },
    [languageKeys],
  );

  const hasEmptyRow = useMemo(() => {
    return watchedItems?.some((item: TranslationsFormItem) => isItemEmpty(item));
  }, [watchedItems, isItemEmpty]);

  return {
    methods,
    fields,
    remove,
    append,
    watchedItems,
    languageKeys,
    hasEmptyRow,
    isDirtyLastItem,
    isItemEmpty,
  };
};
