import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import type { ContainerTypeUpdate, DrinkSubtypeUpdate, DrinkTypeUpdate, VolumeUpdate } from 'api/endpoints';
import { batchTranslationEndpoints } from 'api/endpoints';
import { TRANSLATION_QUERY_KEYS, useGetAllTranslations } from 'api/hooks/useTranslations';

import { useGetSupportedLanguages } from 'queries/supported-languages';

import type { LanguageInfo } from 'types/models/supported-language.model';
import {
  compareTranslationItems,
  convertLegacyFieldsToTranslations,
  convertTranslationsToLegacyFields,
  getLanguageFieldName,
} from '../utils/translation-helpers';

type SectionKey = 'drinkSubtypes' | 'volumes' | 'drinkTypes' | 'containerTypes';

interface TranslationItem {
  id: string;
  name: string;
  [key: string]: any; // For language fields and other properties
}

interface SectionData {
  key: SectionKey;
  title: string;
  description: string;
  items: TranslationItem[];
}

const cloneItem = (item: TranslationItem): TranslationItem => {
  const cloned: TranslationItem = { ...item };
  // Clone all language fields
  Object.keys(item).forEach((key) => {
    if (key.startsWith('name_')) {
      cloned[key] = item[key];
    }
  });
  return cloned;
};

const areSectionsEqual = (
  current: TranslationItem[],
  initial: TranslationItem[],
  supportedLanguages: Array<{ isoCode: string }>,
): boolean => {
  if (current.length !== initial.length) return false;

  for (let i = 0; i < current.length; i += 1) {
    const currentItem = current[i];
    const initialItem = initial[i];

    if (currentItem.id !== initialItem.id) return false;
    if (currentItem.name !== initialItem.name) return false;

    // Check all language fields
    for (const lang of supportedLanguages) {
      const fieldName = getLanguageFieldName(lang.isoCode);
      if ((currentItem[fieldName] || '') !== (initialItem[fieldName] || '')) {
        return false;
      }
    }
  }

  return true;
};

export const useProductTranslationSections = () => {
  const queryClient = useQueryClient();
  const {
    data: translationsData,
    isLoading: translationsLoading,
    refetch: refetchTranslations,
  } = useGetAllTranslations();
  const { data: supportedLanguagesData, isLoading: languagesLoading } = useGetSupportedLanguages();
  const isMountedRef = useRef(true);

  const [sections, setSections] = useState<SectionData[]>([]);
  const [initialSections, setInitialSections] = useState<SectionData[]>([]);
  const [isReady, setIsReady] = useState(false);
  const isInitializedRef = useRef(false);

  const supportedLanguages = useMemo<LanguageInfo[]>(() => {
    if (!supportedLanguagesData || !Array.isArray(supportedLanguagesData)) return [];
    return supportedLanguagesData.map((lang) => ({
      isoCode: lang.isoCode,
      displayName: lang.displayName,
      nativeName: lang.nativeName,
      flagCode: lang.flagCode ?? null,
    }));
  }, [supportedLanguagesData]);

  // Initialize sections from API data
  useEffect(
    function initializeSections() {
      isMountedRef.current = true;

      if (
        !isInitializedRef.current &&
        translationsData &&
        !translationsLoading &&
        supportedLanguages.length > 0 &&
        !languagesLoading
      ) {
        const convertItems = (items: any[]): TranslationItem[] => {
          return items.map(
            (item) => convertTranslationsToLegacyFields(item, supportedLanguages) as TranslationItem,
          );
        };

        const newSections: SectionData[] = [
          {
            key: 'drinkSubtypes',
            title: 'admin.pages.translations.content.drinkSubtypes.title',
            description: 'admin.pages.translations.content.drinkSubtypes.description',
            items: convertItems(translationsData.drinkSubtypes || []),
          },
          {
            key: 'volumes',
            title: 'admin.pages.translations.content.volumes.title',
            description: 'admin.pages.translations.content.volumes.description',
            items: convertItems(translationsData.volumes || []),
          },
          {
            key: 'drinkTypes',
            title: 'admin.pages.translations.content.drinkTypes.title',
            description: 'admin.pages.translations.content.drinkTypes.description',
            items: convertItems(translationsData.drinkTypes || []),
          },
          {
            key: 'containerTypes',
            title: 'admin.pages.translations.content.containerTypes.title',
            description: 'admin.pages.translations.content.containerTypes.description',
            items: convertItems(translationsData.containerTypes || []),
          },
        ];

        if (isMountedRef.current) {
          setSections(newSections);
          setInitialSections(
            newSections.map((section) => ({
              ...section,
              items: section.items.map(cloneItem),
            })),
          );
          setIsReady(true);
          // Allow re-initialization when data changes (e.g., after save and refetch)
          // This ensures the UI updates with fresh data from the server
          isInitializedRef.current = true;
        }
      }

      return () => {
        isMountedRef.current = false;
      };
    },
    // The isInitializedRef guard prevents re-initialization after first load
    // We include translationsData so the effect runs when data first arrives
    [translationsData, translationsLoading, languagesLoading, supportedLanguages.length],
  );

  const handleValueChange = useCallback(
    (sectionKey: SectionKey, itemId: string, fieldName: string, value: string) => {
      setSections((prev) =>
        prev.map((section) =>
          section.key === sectionKey
            ? {
                ...section,
                items: section.items.map((item) =>
                  item.id === itemId ? { ...item, [fieldName]: value } : item,
                ),
              }
            : section,
        ),
      );
    },
    [],
  );

  const resetSection = useCallback(
    (sectionKey: SectionKey) => {
      const initialSection = initialSections.find((section) => section.key === sectionKey);
      if (!initialSection) return;

      setSections((prev) =>
        prev.map((section) =>
          section.key === sectionKey
            ? {
                ...section,
                items: initialSection.items.map(cloneItem),
              }
            : section,
        ),
      );
    },
    [initialSections],
  );

  // Helper function to check if an item is empty (all language fields are empty)
  const isItemEmpty = useCallback(
    (item: TranslationItem): boolean => {
      // Check if name is empty
      if (item.name && item.name.trim()) {
        return false;
      }

      // Check if any language field has a value
      for (const lang of supportedLanguages) {
        const fieldName = getLanguageFieldName(lang.isoCode);
        const value = item[fieldName];
        if (value && typeof value === 'string' && value.trim()) {
          return false;
        }
      }

      return true;
    },
    [supportedLanguages],
  );

  const saveSection = useCallback(
    async (sectionKey: SectionKey) => {
      const section = sections.find((s) => s.key === sectionKey);
      const initialSection = initialSections.find((s) => s.key === sectionKey);

      if (!section || !initialSection) {
        throw new Error(`Section ${sectionKey} not found`);
      }

      // Filter out empty items (new items that are empty should not be saved)
      const nonEmptyItems = section.items.filter((item) => !isItemEmpty(item));

      // Prepare updates by comparing with original data
      const updates: Array<{ id: string; updates: DrinkTypeUpdate | VolumeUpdate | ContainerTypeUpdate }> =
        [];
      const deletions: string[] = []; // IDs of items that were emptied (existing items)

      for (const item of nonEmptyItems) {
        const originalItem = initialSection.items.find((orig) => orig.id === item.id);

        // If item doesn't exist in original, it's a new item - skip (already filtered out empty ones)
        if (!originalItem) {
          continue;
        }

        // Convert to JSON format for comparison
        const convertedItem = convertLegacyFieldsToTranslations(item, supportedLanguages);
        const convertedOriginal = convertLegacyFieldsToTranslations(originalItem, supportedLanguages);

        const changes = compareTranslationItems(convertedItem, convertedOriginal, supportedLanguages);

        if (Object.keys(changes).length > 0) {
          updates.push({ id: item.id, updates: changes as any });
        }
      }

      // Find items that existed in original but are now empty (should be deleted)
      for (const originalItem of initialSection.items) {
        const currentItem = section.items.find((item) => item.id === originalItem.id);

        // If item exists in original but is now empty, mark for deletion
        if (currentItem && isItemEmpty(currentItem)) {
          deletions.push(originalItem.id);
        }
      }

      // Handle deletions by setting isActive to false (soft delete)
      // TODO: If hard delete endpoints exist, use those instead
      if (deletions.length > 0) {
        const deleteUpdates = deletions.map((id) => {
          // Try to find item in current section first, then fall back to original
          const currentItem = section.items.find((i) => i.id === id);
          const originalItem = initialSection.items.find((i) => i.id === id);
          const item = currentItem || originalItem;

          const deleteUpdate: any = {
            id,
            updates: { isActive: false },
          };

          // For drinkSubtypes, we need to include drinkTypeId
          if (sectionKey === 'drinkSubtypes' && item?.drinkTypeId) {
            deleteUpdate.drinkTypeId = item.drinkTypeId;
          }

          return deleteUpdate;
        });
        updates.push(...deleteUpdates);
      }

      if (updates.length === 0 && deletions.length === 0) {
        return { success: true, message: 'No changes to save' };
      }

      // Prepare batch update data
      // For drinkSubtypes, we need to include drinkTypeId with each update
      const batchData: any = { [sectionKey]: updates };

      if (sectionKey === 'drinkSubtypes') {
        // Drink subtypes require drinkTypeId, so we need to include it in each update
        batchData[sectionKey] = updates.map((update: any) => {
          // If drinkTypeId is already in the update (from deleteUpdates), use it
          if (update.drinkTypeId) {
            return update;
          }

          // Otherwise, find it from the current or original item
          const item = section.items.find((i) => i.id === update.id) ||
                       initialSection.items.find((i) => i.id === update.id);

          if (!item?.drinkTypeId) {
            throw new Error(`drinkTypeId is required for drink subtype ${update.id}`);
          }

          return {
            ...update,
            drinkTypeId: item.drinkTypeId,
          };
        });
      }

      await batchTranslationEndpoints.batchUpdateTranslations(batchData);

      // Invalidate React Query cache to ensure fresh data on next fetch
      // This ensures the UI shows updated values when navigating away and back
      await queryClient.invalidateQueries({
        queryKey: TRANSLATION_QUERY_KEYS.all,
      });

      // Also invalidate the specific section's query key
      const sectionQueryKey = TRANSLATION_QUERY_KEYS[sectionKey as keyof typeof TRANSLATION_QUERY_KEYS];
      if (sectionQueryKey) {
        await queryClient.invalidateQueries({
          queryKey: sectionQueryKey,
        });
      }

      // Update initial sections to reflect saved state
      // Remove empty items and deleted items from the saved state
      const savedItems = nonEmptyItems.filter((item) => !deletions.includes(item.id));

      setInitialSections((prev) =>
        prev.map((s) =>
          s.key === sectionKey
            ? {
                ...s,
                items: savedItems.map(cloneItem),
              }
            : s,
        ),
      );

      // Also update the current sections to match what was saved
      // Remove empty items and deleted items
      setSections((prev) =>
        prev.map((s) =>
          s.key === sectionKey
            ? {
                ...s,
                items: savedItems.map(cloneItem),
              }
            : s,
        ),
      );

      const updateCount = updates.length - deletions.length; // Don't count deletions as updates
      const deleteCount = deletions.length;
      let message = '';
      if (updateCount > 0 && deleteCount > 0) {
        message = `Saved ${updateCount} item(s) and deleted ${deleteCount} item(s)`;
      } else if (updateCount > 0) {
        message = `Saved ${updateCount} item(s)`;
      } else if (deleteCount > 0) {
        message = `Deleted ${deleteCount} item(s)`;
      }

      return { success: true, message };
    },
    [sections, initialSections, supportedLanguages, isItemEmpty],
  );

  const isSectionDirty = useCallback(
    (sectionKey: SectionKey) => {
      const current = sections.find((s) => s.key === sectionKey);
      const initial = initialSections.find((s) => s.key === sectionKey);

      if (!current || !initial) return false;

      return !areSectionsEqual(current.items, initial.items, supportedLanguages);
    },
    [sections, initialSections, supportedLanguages],
  );

  const addNewItem = useCallback(
    (sectionKey: SectionKey) => {
      const section = sections.find((s) => s.key === sectionKey);
      if (!section) return;

      // Create a new empty item with a temporary ID
      const newItem: TranslationItem = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: '',
      };

      // Initialize all language fields as empty strings
      supportedLanguages.forEach((lang) => {
        const fieldName = getLanguageFieldName(lang.isoCode);
        newItem[fieldName] = '';
      });

      // Add the new item to the section
      setSections((prev) =>
        prev.map((s) =>
          s.key === sectionKey
            ? {
                ...s,
                items: [...s.items, newItem],
              }
            : s,
        ),
      );
    },
    [sections, supportedLanguages],
  );

  return {
    sections,
    supportedLanguages,
    isLoading: translationsLoading || languagesLoading || !isReady,
    handleValueChange,
    resetSection,
    saveSection,
    isSectionDirty,
    addNewItem,
  };
};
