import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import type { RegionLocale } from '@workspace/config/i18n.config';
import type { TranslationsFormItem } from '../../translationsProduct.types';
import {
  getLanguageKeys,
  isItemEmpty as isItemEmptyUtil,
} from '../../../TranslationPages/utils/translationsTable.utils';

interface UseTranslationsTableFormOptions {
  items: TranslationsFormItem[];
  supportedLanguages: RegionLocale[];
}

interface UseTranslationsTableFormReturn {
  methods: UseFormReturn<{ items: TranslationsFormItem[] }>;
  fields: ReturnType<typeof useFieldArray<{ items: TranslationsFormItem[] }, 'items'>>['fields'];
  remove: ReturnType<typeof useFieldArray<{ items: TranslationsFormItem[] }, 'items'>>['remove'];
  append: ReturnType<typeof useFieldArray<{ items: TranslationsFormItem[] }, 'items'>>['append'];
  watchedItems: TranslationsFormItem[];
  languageKeys: string[];
  hasEmptyRow: boolean;
  isDirtyLastItem: boolean;
  isItemEmpty: (item: TranslationsFormItem) => boolean;
}

/**
 * Shared hook for RHF form setup, reset logic, and empty row detection
 * Used by both TranslationsTable and TranslationsTableExpandable
 */
export const useTranslationsTableForm = ({
  items,
  supportedLanguages,
}: UseTranslationsTableFormOptions): UseTranslationsTableFormReturn => {
  // ======================================================================== //
  // RHF Setup
  // ======================================================================== //

  const methods = useForm({
    mode: 'onChange',
    defaultValues: { items },
  });

  const { control, watch } = methods;

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'items',
    keyName: 'fieldId', // 🔑 CRITICAL: This tells RHF to use 'fieldId' for its internal tracking, leaving 'id' free for our actual database CUID
  });

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

    // Only reset if items actually changed (not just a re-render)
    const itemsChanged = JSON.stringify(prevItemsRef.current) !== JSON.stringify(items);
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

  const watchedItems = watch('items');
  const isDirtyLastItem = Boolean(watchedItems.at(-1)?.name);

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
