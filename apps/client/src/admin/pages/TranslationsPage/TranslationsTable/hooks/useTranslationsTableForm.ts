import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import type { RegionLocale } from '@workspace/config/i18n.config';
import type { TranslationsFormItem } from '../../translations.types';
import { languagesCodeToKey, encodeRHFKey } from 'admin/utils/languages.utils';

interface UseTranslationsTableFormOptions {
  items: TranslationsFormItem[];
  supportedLanguages: RegionLocale[];
}

// Form structure: { items: { [key: string]: TranslationsFormItem } }
type TranslationsFormData = {
  items: Record<string, TranslationsFormItem>;
};

interface UseTranslationsTableFormReturn {
  methods: UseFormReturn<TranslationsFormData>;
  fields: TranslationsFormItem[]; // Array for rendering order
  remove: (key: string) => void;
  append: (item: TranslationsFormItem) => void;
  watchedItems: Record<string, TranslationsFormItem>;
  languageKeys: string[];
  hasEmptyRow: boolean;
  isDirtyLastItem: boolean;
  isItemEmpty: (item: TranslationsFormItem) => boolean;
}

/**
 * Shared hook for RHF form setup, reset logic, and empty row detection
 * Uses translation keys as field identifiers instead of array indices
 */
export const useTranslationsTableForm = ({
  items,
  supportedLanguages,
}: UseTranslationsTableFormOptions): UseTranslationsTableFormReturn => {
  // ======================================================================== //
  // Transform items array to object keyed by translation key
  // ======================================================================== //

  const itemsAsObject = useMemo(() => {
    const obj: Record<string, TranslationsFormItem> = {};
    items.forEach((item) => {
      // Use the translation key as the object key, but encode it for RHF
      // For new items without a key, use the id as fallback
      const key = item.key || item.id;
      const encodedKey = encodeRHFKey(key);
      obj[encodedKey] = item;
    });
    return obj;
  }, [items]);

  // ======================================================================== //
  // RHF Setup
  // ======================================================================== //

  const methods = useForm<TranslationsFormData>({
    mode: 'onChange',
    defaultValues: { items: itemsAsObject },
  });

  const { watch, setValue } = methods;

  // Convert object back to array for rendering (maintains order from original items)
  const fields = useMemo(() => {
    return items.map((item) => item);
  }, [items]);

  // Remove function: delete by key (key should be encoded)
  const remove = useCallback(
    (key: string) => {
      const encodedKey = encodeRHFKey(key);
      const currentItems = watch('items');
      const { [encodedKey]: removed, ...rest } = currentItems;
      setValue('items', rest, { shouldDirty: true });
    },
    [watch, setValue],
  );

  // Append function: add new item by key (encode key for RHF)
  const append = useCallback(
    (item: TranslationsFormItem) => {
      const key = item.key || item.id;
      const encodedKey = encodeRHFKey(key);
      setValue(`items.${encodedKey}`, item, { shouldDirty: true });
    },
    [setValue],
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
      // Transform items array to object keyed by translation key (encoded for RHF)
      const newItemsObject: Record<string, TranslationsFormItem> = {};
      items.forEach((item) => {
        const key = item.key || item.id;
        const encodedKey = encodeRHFKey(key);
        newItemsObject[encodedKey] = item;
      });

      // Reset with full items object from refetch
      // ⚠️ keepDefaultValues: false is CRITICAL - updates defaultValues to new items
      // Otherwise, form compares against old defaults and everything appears dirty
      methods.reset(
        { items: newItemsObject },
        { keepValues: false, keepDefaultValues: false, keepDirty: false },
      );
      prevItemsRef.current = items;
    }
  }, [items, methods]);

  // ======================================================================== //
  // Empty Row Detection
  // ======================================================================== //

  const languageKeys = useMemo(() => supportedLanguages.map(languagesCodeToKey), [supportedLanguages]);

  const watchedItems = watch('items'); // This is now an object, not an array

  // Get items as array for checking last item
  const watchedItemsArray = useMemo(() => Object.values(watchedItems || {}), [watchedItems]);
  const isDirtyLastItem = Boolean(watchedItemsArray.at(-1)?.key);

  // Helper: check if item is empty (all language fields empty)
  const isItemEmpty = useCallback(
    (item: TranslationsFormItem): boolean => {
      return languageKeys.every((key) => !item[key]?.trim());
    },
    [languageKeys],
  );

  const hasEmptyRow = useMemo(() => {
    return watchedItemsArray.some((item: TranslationsFormItem) => isItemEmpty(item));
  }, [watchedItemsArray, isItemEmpty]);

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
