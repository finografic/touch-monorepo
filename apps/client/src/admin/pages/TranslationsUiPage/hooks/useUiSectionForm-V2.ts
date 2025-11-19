import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type {
  SupportedLanguage,
  UiLabelSectionData,
} from 'admin/pages/TranslationsUiPage/TranslationsUiPage.types';
import { EndpointHelper } from 'api/api.endpoints';

import type { TranslationsUiModel } from 'types/models/translations-ui.model';

const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { isoCode: 'es-ES', displayName: 'Spanish', nativeName: 'Español' },
  { isoCode: 'en-GB', displayName: 'English', nativeName: 'English' },
  { isoCode: 'ca-ES', displayName: 'Catalan', nativeName: 'Català' },
];

const cloneSection = (section: UiLabelSectionData): UiLabelSectionData => ({
  ...section,
  items: section.items.map((item) => ({
    ...item,
    values: { ...item.values },
  })),
});

const areSectionsEqual = (current?: UiLabelSectionData, initial?: UiLabelSectionData) => {
  if (!current || !initial) return false;
  if (current.items.length !== initial.items.length) return false;

  for (let index = 0; index < current.items.length; index += 1) {
    const currentItem = current.items[index];
    const initialItem = initial.items[index];

    if (currentItem.key !== initialItem.key) {
      return false;
    }

    const languageCodes = new Set([...Object.keys(currentItem.values), ...Object.keys(initialItem.values)]);

    for (const languageCode of languageCodes) {
      if ((currentItem.values[languageCode] || '') !== (initialItem.values[languageCode] || '')) {
        return false;
      }
    }
  }

  return true;
};

export const useUiLabelSections = () => {
  const supportedLanguages = useMemo(() => SUPPORTED_LANGUAGES, []);

  const [sections, setSections] = useState<UiLabelSectionData[]>([]);
  const [initialSections, setInitialSections] = useState<UiLabelSectionData[]>([]);
  const [isReady, setIsReady] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchSections = async () => {
      try {
        // EndpointHelper returns ApiResponse<TranslationsUiModel>, so we need response.data.sections
        const response = await EndpointHelper.getUiLabels();
        if (!isMountedRef.current) return;

        // ApiResponse structure: { data: TranslationsUiModel, message?: string, timestamp: number }
        // The EndpointHelper unwraps one level, so response is ApiResponse<TranslationsUiModel>
        if (response?.data?.sections) {
          const clonedSections = response.data.sections.map(cloneSection);
          setSections(clonedSections);
          setInitialSections(response.data.sections.map(cloneSection));
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error('[useUiLabelSections] Failed to load UI labels:', error);
        }
      } finally {
        if (isMountedRef.current) {
          setIsReady(true);
        }
      }
    };

    fetchSections();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleValueChange = useCallback(
    (sectionKey: string, itemKey: string, languageCode: string, value: string) => {
      setSections((prev) =>
        prev.map((section) =>
          section.key === sectionKey
            ? {
                ...section,
                items: section.items.map((item) =>
                  item.key === itemKey
                    ? {
                        ...item,
                        values: {
                          ...item.values,
                          [languageCode]: value,
                        },
                      }
                    : item,
                ),
              }
            : section,
        ),
      );
    },
    [],
  );

  const resetSection = useCallback(
    (sectionKey: string) => {
      const initialSection = initialSections.find((section) => section.key === sectionKey);
      if (!initialSection) {
        return;
      }

      setSections((prev) =>
        prev.map((section) => (section.key === sectionKey ? cloneSection(initialSection) : section)),
      );
    },
    [initialSections],
  );

  const saveSection = useCallback(
    async (sectionKey: string) => {
      const section = sections.find((item) => item.key === sectionKey);
      if (!section) {
        throw new Error(`Section ${sectionKey} not found`);
      }

      const response = await EndpointHelper.saveUiLabels({
        sections: [
          {
            key: section.key,
            items: section.items,
          },
        ],
      });

      setInitialSections((prev) =>
        prev.map((item) => (item.key === sectionKey ? cloneSection(section) : item)),
      );

      return response;
    },
    [sections],
  );

  const isSectionDirty = useCallback(
    (sectionKey: string) => {
      const current = sections.find((section) => section.key === sectionKey);
      const initial = initialSections.find((section) => section.key === sectionKey);

      if (!current || !initial) {
        return false;
      }

      return !areSectionsEqual(current, initial);
    },
    [sections, initialSections],
  );

  return {
    sections,
    supportedLanguages,
    isLoading: !isReady,
    handleValueChange,
    resetSection,
    saveSection,
    isSectionDirty,
  };
};
