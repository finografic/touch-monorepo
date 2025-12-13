import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { ContainerTypeUpdate, DrinkSubtypeUpdate, DrinkTypeUpdate, VolumeUpdate } from 'api/endpoints';
import { batchTranslationEndpoints, drinkSubtypeEndpoints, drinkTypeEndpoints } from 'api/endpoints';
import { TRANSLATION_QUERY_KEYS, useGetAllTranslations } from 'api/hooks/useTranslations';
import { GET_ORDERS_READABLE_QUERYKEY } from 'queries/orders';
import { useGetSupportedLanguages } from 'queries/supported-languages';
import type { LanguageInfo } from 'types/models/supported-language.model';
import {
  compareTranslationItems,
  convertLegacyFieldsToTranslations,
  convertTranslationsToLegacyFields,
  ensureLanguageFields,
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
  // Deep clone all fields to ensure proper comparison
  const cloned: TranslationItem = { ...item };
  // Copy all properties (including language fields like name_es_es, name_en_gb, etc.)
  Object.keys(item).forEach((key) => {
    cloned[key] = item[key];
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

interface DeleteCallbackContext {
  sectionKey: SectionKey;
  itemId: string;
  drinkTypeId?: string;
  itemName?: string;
}

interface UseProductTranslationSectionsOptions {
  /**
   * Optional callback executed after successful deletion.
   * Use this for additional cleanup, cascading deletes, or other post-deletion processes.
   */
  onDeleteCallback?: (context: DeleteCallbackContext) => Promise<void> | void;
}

export const useProductTranslationSections = (options: UseProductTranslationSectionsOptions = {}) => {
  const { onDeleteCallback } = options;
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

        // If item doesn't exist in original, it's a new item - include it in updates
        if (!originalItem) {
          // Convert to JSON format for new items
          const convertedItem = convertLegacyFieldsToTranslations(item, supportedLanguages);

          // Ensure all language fields are included (even if empty) for new items
          const translations: Record<string, string> = {};
          supportedLanguages.forEach((lang) => {
            const fieldName = getLanguageFieldName(lang.isoCode);
            translations[lang.isoCode] = item[fieldName] || '';
          });

          // For new items, include all fields (name and translations)
          const newItemUpdate: any = {
            name: convertedItem.name || item.name || '',
            translations,
          };

          // Provide required defaults for new drinkTypes
          if (sectionKey === 'drinkTypes') {
            newItemUpdate.hasSubtypes = item.hasSubtypes ?? false;
            newItemUpdate.defaultTempConsume = (item as any).defaultTempConsume ?? 5;
            newItemUpdate.defaultTempFreeze = (item as any).defaultTempFreeze ?? -2;
          }

          // For drinkSubtypes, include drinkTypeId
          if (sectionKey === 'drinkSubtypes' && item.drinkTypeId) {
            newItemUpdate.drinkTypeId = item.drinkTypeId;
            newItemUpdate.defaultTempConsume = (item as any).defaultTempConsume ?? 5;
            newItemUpdate.defaultTempFreeze = (item as any).defaultTempFreeze ?? -2;
          }

          updates.push({ id: item.id, updates: newItemUpdate });
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
          const item =
            section.items.find((i) => i.id === update.id) ||
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

      const results = await batchTranslationEndpoints.batchUpdateTranslations(batchData);

      // Track successfully saved item IDs (for clearing dirty state)
      const successfullySavedIds = new Set<string>();

      // Map temp IDs to new CUIDs from server response (for newly created items)
      const tempIdToNewIdMap = new Map<string, string>();

      // Helper to convert API result to legacy format
      // This ensures we use the actual saved data from the server, not local state
      const convertResultToLegacy = (result: any): TranslationItem => {
        return convertTranslationsToLegacyFields(result, supportedLanguages) as TranslationItem;
      };
      if (sectionKey === 'drinkSubtypes' && batchData.drinkSubtypes) {
        // Calculate the starting index for drinkSubtype results in the results array
        // Results are in order: drinkTypes, drinkSubtypes, volumes, containerTypes
        let drinkSubtypeResultIndex = 0;
        if (batchData.drinkTypes) {
          drinkSubtypeResultIndex += batchData.drinkTypes.length;
        }

        // Map temp IDs to new CUIDs and track successfully saved items
        batchData.drinkSubtypes.forEach((update: any, index: number) => {
          const result = results[drinkSubtypeResultIndex + index];
          if (result && result.id) {
            if (update.id.startsWith('temp-')) {
              // This is a new item - map temp ID to new CUID
              tempIdToNewIdMap.set(update.id, result.id);
              successfullySavedIds.add(result.id); // Track by new CUID
            } else {
              // This is an existing item - track by original ID
              successfullySavedIds.add(update.id);
            }
          }
        });
      } else {
        // For other section types (drinkTypes, volumes, containerTypes), track all successfully saved items
        const sectionUpdates = batchData[sectionKey as keyof typeof batchData] as
          | Array<{ id: string }>
          | undefined;
        if (sectionUpdates) {
          // Calculate the starting index for this section's results
          // Results are in order: drinkTypes, drinkSubtypes, volumes, containerTypes
          let sectionResultIndex = 0;
          if (sectionKey === 'drinkTypes') {
            // drinkTypes are first, so index starts at 0
            sectionResultIndex = 0;
          } else if (sectionKey === 'volumes') {
            // volumes start after drinkTypes and drinkSubtypes
            if (batchData.drinkTypes) sectionResultIndex += batchData.drinkTypes.length;
            if (batchData.drinkSubtypes) sectionResultIndex += batchData.drinkSubtypes.length;
          } else if (sectionKey === 'containerTypes') {
            // containerTypes start after drinkTypes, drinkSubtypes, and volumes
            if (batchData.drinkTypes) sectionResultIndex += batchData.drinkTypes.length;
            if (batchData.drinkSubtypes) sectionResultIndex += batchData.drinkSubtypes.length;
            if (batchData.volumes) sectionResultIndex += batchData.volumes.length;
          }

          sectionUpdates.forEach((update: any, index: number) => {
            const result = results[sectionResultIndex + index];
            if (result && result.id) {
              successfullySavedIds.add(update.id);
            }
          });
        }
      }

      // Invalidate React Query cache to ensure fresh data on next fetch
      // This ensures the UI shows updated values when navigating away and back
      // Invalidate translation query keys (used by translation page)
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

      // IMPORTANT: Also invalidate the actual data query keys used by dropdowns in other pages
      // These are different from the translation query keys
      // This ensures dropdowns in AdminOrdersPage, etc. show updated data immediately
      if (sectionKey === 'drinkTypes') {
        await queryClient.invalidateQueries({
          queryKey: ['get-drink-types'],
        });
      } else if (sectionKey === 'drinkSubtypes') {
        // Invalidate all drink subtype queries (they're keyed by drinkTypeId)
        await queryClient.invalidateQueries({
          queryKey: ['get-drink-subtypes'],
        });
        // Also invalidate drink types since subtypes affect drink type data
        await queryClient.invalidateQueries({
          queryKey: ['get-drink-types'],
        });
      } else if (sectionKey === 'volumes') {
        await queryClient.invalidateQueries({
          queryKey: ['get-drink-volumes'],
        });
      } else if (sectionKey === 'containerTypes') {
        await queryClient.invalidateQueries({
          queryKey: ['get-container-types'],
        });
      }

      // Also refresh orders-readable to reflect cascades (create/edit/delete impacts orders view)
      await queryClient.invalidateQueries({ queryKey: GET_ORDERS_READABLE_QUERYKEY });

      // Refetch translations data to update sections with fresh data from server
      // This ensures that when switching tabs, the data is up-to-date
      // Note: refetchTranslations() calls refetch on all individual queries
      // The data will be updated via React Query, and the useEffect will handle re-initialization
      // However, we need to allow re-initialization after save, so we reset the guard
      await refetchTranslations();

      // Reset initialization guard to allow sections to update with fresh data
      // This ensures tabs show updated data when switching
      isInitializedRef.current = false;

      // Update items: replace temp IDs with new CUIDs and remove deleted items
      // Separate existing items from new items to ensure new items are appended to the END
      const existingItems = nonEmptyItems.filter(
        (item) => !deletions.includes(item.id) && !tempIdToNewIdMap.has(item.id),
      );
      const newItems = nonEmptyItems
        .filter((item) => !deletions.includes(item.id) && tempIdToNewIdMap.has(item.id))
        .map((item) => {
          // Replace temp ID with the new CUID from server
          return {
            ...item,
            id: tempIdToNewIdMap.get(item.id)!,
          };
        });

      // Append new items to the END of the array
      const savedItems = [...existingItems, ...newItems];

      // Extract saved results from API response for this section
      // This is the actual data from the server, which we'll use to update initialSections
      let savedResultsFromAPI: any[] = [];
      if (sectionKey === 'drinkSubtypes' && batchData.drinkSubtypes) {
        let drinkSubtypeResultIndex = 0;
        if (batchData.drinkTypes) {
          drinkSubtypeResultIndex += batchData.drinkTypes.length;
        }
        savedResultsFromAPI = results.slice(
          drinkSubtypeResultIndex,
          drinkSubtypeResultIndex + batchData.drinkSubtypes.length,
        );
      } else {
        let sectionResultIndex = 0;
        if (sectionKey === 'drinkTypes') {
          sectionResultIndex = 0;
        } else if (sectionKey === 'volumes') {
          if (batchData.drinkTypes) sectionResultIndex += batchData.drinkTypes.length;
          if (batchData.drinkSubtypes) sectionResultIndex += batchData.drinkSubtypes.length;
        } else if (sectionKey === 'containerTypes') {
          if (batchData.drinkTypes) sectionResultIndex += batchData.drinkTypes.length;
          if (batchData.drinkSubtypes) sectionResultIndex += batchData.drinkSubtypes.length;
          if (batchData.volumes) sectionResultIndex += batchData.volumes.length;
        }
        const sectionUpdates = batchData[sectionKey as keyof typeof batchData] as
          | Array<{ id: string }>
          | undefined;
        if (sectionUpdates) {
          savedResultsFromAPI = results.slice(sectionResultIndex, sectionResultIndex + sectionUpdates.length);
        }
      }

      // Convert API results to legacy format
      // Ensure all language fields are included by using ensureLanguageFields
      const savedItemsFromAPI = savedResultsFromAPI.map((result) => {
        const converted = convertResultToLegacy(result);
        // Ensure all language fields exist (even if empty) for proper comparison
        return ensureLanguageFields(converted, supportedLanguages) as TranslationItem;
      });

      // Also update the current sections to match what was saved (with new CUIDs)
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

      // Update initial sections to reflect saved state (this clears dirty state)
      // Use the actual API response data, not local state, to ensure accuracy
      setInitialSections((prev) =>
        prev.map((s) =>
          s.key === sectionKey
            ? {
                ...s,
                items: s.items
                  .filter((initialItem) => {
                    // Remove deleted items from initialSections (they were successfully deleted)
                    return !(deletions.includes(initialItem.id) && successfullySavedIds.has(initialItem.id));
                  })
                  .map((initialItem) => {
                    // Find the corresponding saved item from API response
                    const savedItemFromAPI = savedItemsFromAPI.find((item) => item.id === initialItem.id);

                    // If this item was successfully saved, update initialItem with API response data
                    if (savedItemFromAPI && successfullySavedIds.has(initialItem.id)) {
                      return cloneItem(savedItemFromAPI);
                    }

                    // If item was not saved (or failed), keep original initialItem (preserves dirty state)
                    return initialItem;
                  })
                  .concat(
                    // Add new items that were successfully saved (they don't exist in initialItems yet)
                    // These are items with temp IDs that got new CUIDs from the server
                    savedItemsFromAPI
                      .filter((item) => {
                        // Check if this is a new item that was successfully saved
                        // New items have IDs that don't exist in initialItems
                        const existsInInitial = s.items.some((initial) => initial.id === item.id);
                        return !existsInInitial && successfullySavedIds.has(item.id);
                      })
                      .map((item) => cloneItem(item)),
                  ),
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
    (sectionKey: SectionKey, drinkTypeIdForSubtype?: string) => {
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

      // For subtypes, assign the current drinkTypeId so it appears in the correct group
      if (sectionKey === 'drinkSubtypes' && drinkTypeIdForSubtype) {
        newItem.drinkTypeId = drinkTypeIdForSubtype;
      }

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

  /**
   * Immediately delete an item (hard delete via DELETE) and refresh caches.
   * For drinkSubtypes, drinkTypeId is required.
   *
   * After successful deletion, calls onDeleteCallback if provided for additional cleanup.
   */
  const deleteItemImmediate = useCallback(
    async (sectionKey: SectionKey, itemId: string, drinkTypeId?: string) => {
      if (!itemId) return;

      // Find the item to get its name for the callback
      const section = sections.find((s) => s.key === sectionKey);
      const item = section?.items.find((i) => i.id === itemId);
      const itemName = item?.name;

      // Call API immediately (hard delete)
      if (sectionKey === 'drinkTypes') {
        await drinkTypeEndpoints.deleteDrinkType(itemId);
      } else if (sectionKey === 'drinkSubtypes') {
        if (!drinkTypeId) {
          throw new Error('drinkTypeId is required to delete a drink subtype');
        }
        await drinkSubtypeEndpoints.deleteDrinkSubtype(itemId, drinkTypeId);
      } else if (sectionKey === 'volumes') {
        // TODO: add volume delete endpoint when available (fallback to soft delete)
        await batchTranslationEndpoints.batchUpdateTranslations({
          volumes: [{ id: itemId, updates: { isActive: false } }],
        });
      } else if (sectionKey === 'containerTypes') {
        // TODO: add container type delete endpoint when available (fallback to soft delete)
        await batchTranslationEndpoints.batchUpdateTranslations({
          containerTypes: [{ id: itemId, updates: { isActive: false } }],
        });
      }

      // Remove from local state (sections and initialSections) to clear dirty flags
      setSections((prev) =>
        prev.map((s) =>
          s.key === sectionKey ? { ...s, items: s.items.filter((item) => item.id !== itemId) } : s,
        ),
      );
      setInitialSections((prev) =>
        prev.map((s) =>
          s.key === sectionKey ? { ...s, items: s.items.filter((item) => item.id !== itemId) } : s,
        ),
      );

      // Invalidate translation queries
      await queryClient.invalidateQueries({ queryKey: TRANSLATION_QUERY_KEYS.all });
      const sectionQueryKey = TRANSLATION_QUERY_KEYS[sectionKey as keyof typeof TRANSLATION_QUERY_KEYS];
      if (sectionQueryKey) {
        await queryClient.invalidateQueries({ queryKey: sectionQueryKey });
      }

      // Invalidate data queries used elsewhere
      if (sectionKey === 'drinkTypes') {
        await queryClient.invalidateQueries({ queryKey: ['get-drink-types'] });
      } else if (sectionKey === 'drinkSubtypes') {
        await queryClient.invalidateQueries({ queryKey: ['get-drink-subtypes'] });
        await queryClient.invalidateQueries({ queryKey: ['get-drink-types'] });
      } else if (sectionKey === 'volumes') {
        await queryClient.invalidateQueries({ queryKey: ['get-drink-volumes'] });
      } else if (sectionKey === 'containerTypes') {
        await queryClient.invalidateQueries({ queryKey: ['get-container-types'] });
      }

      // Orders list depends on these entities; refresh it after deletes
      await queryClient.invalidateQueries({ queryKey: GET_ORDERS_READABLE_QUERYKEY });

      // Execute callback for additional cleanup/processes if provided
      if (onDeleteCallback) {
        try {
          await onDeleteCallback({
            sectionKey,
            itemId,
            drinkTypeId,
            itemName,
          });
        } catch (error) {
          console.error('Error in onDeleteCallback:', error);
          // Don't throw - callback errors shouldn't break the delete flow
          // but we log them for debugging
        }
      }

      // Allow re-init with fresh data if needed
      isInitializedRef.current = false;
    },
    [queryClient, sections, onDeleteCallback],
  );

  const deleteItem = useCallback((sectionKey: SectionKey, itemId: string) => {
    // Remove the item from the current items array
    // On next save, if the item exists in initialItems but not in items, it will be marked for deletion
    setSections((prev) =>
      prev.map((s) =>
        s.key === sectionKey
          ? {
              ...s,
              items: s.items.filter((item) => item.id !== itemId),
            }
          : s,
      ),
    );
  }, []);

  // Update section items (for RHF-based tables)
  const updateSectionItems = useCallback((sectionKey: SectionKey, items: TranslationItem[]) => {
    setSections((prev) =>
      prev.map((section) =>
        section.key === sectionKey
          ? {
              ...section,
              items,
            }
          : section,
      ),
    );
  }, []);

  return {
    sections,
    initialSections,
    supportedLanguages,
    isLoading: translationsLoading || languagesLoading || !isReady,
    handleValueChange,
    resetSection,
    saveSection,
    isSectionDirty,
    addNewItem,
    deleteItem,
    deleteItemImmediate,
    updateSectionItems,
  };
};
