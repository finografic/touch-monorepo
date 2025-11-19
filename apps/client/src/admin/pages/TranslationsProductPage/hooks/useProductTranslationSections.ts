import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ContainerTypeUpdate, DrinkSubtypeUpdate, DrinkTypeUpdate, VolumeUpdate } from 'api/endpoints';
import { batchTranslationEndpoints } from 'api/endpoints';
import { useGetAllTranslations } from 'api/hooks/useTranslations';

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
  const { data: translationsData, isLoading: translationsLoading } = useGetAllTranslations();
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

  const saveSection = useCallback(
    async (sectionKey: SectionKey) => {
      const section = sections.find((s) => s.key === sectionKey);
      const initialSection = initialSections.find((s) => s.key === sectionKey);

      if (!section || !initialSection) {
        throw new Error(`Section ${sectionKey} not found`);
      }

      // Prepare updates by comparing with original data
      const updates: Array<{ id: string; updates: DrinkTypeUpdate | VolumeUpdate | ContainerTypeUpdate }> =
        [];

      for (const item of section.items) {
        const originalItem = initialSection.items.find((orig) => orig.id === item.id);
        if (!originalItem) continue;

        // Convert to JSON format for comparison
        const convertedItem = convertLegacyFieldsToTranslations(item, supportedLanguages);
        const convertedOriginal = convertLegacyFieldsToTranslations(originalItem, supportedLanguages);

        const changes = compareTranslationItems(convertedItem, convertedOriginal, supportedLanguages);

        if (Object.keys(changes).length > 0) {
          updates.push({ id: item.id, updates: changes as any });
        }
      }

      if (updates.length === 0) {
        return { success: true, message: 'No changes to save' };
      }

      // Prepare batch update data
      const batchData: any = { [sectionKey]: updates };

      // Note: drinkSubtypes are not directly updatable via API
      if (sectionKey === 'drinkSubtypes') {
        console.warn('Drink subtype updates are not currently supported via direct API calls');
        throw new Error('Drink subtype updates are not currently supported');
      }

      await batchTranslationEndpoints.batchUpdateTranslations(batchData);

      // Update initial sections to reflect saved state
      setInitialSections((prev) =>
        prev.map((s) =>
          s.key === sectionKey
            ? {
                ...s,
                items: section.items.map(cloneItem),
              }
            : s,
        ),
      );

      return { success: true, message: `Saved ${updates.length} item(s)` };
    },
    [sections, initialSections, supportedLanguages],
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

  return {
    sections,
    supportedLanguages,
    isLoading: translationsLoading || languagesLoading || !isReady,
    handleValueChange,
    resetSection,
    saveSection,
    isSectionDirty,
  };
};
