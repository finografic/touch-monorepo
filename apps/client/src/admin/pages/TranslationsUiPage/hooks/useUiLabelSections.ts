import { useCallback, useEffect, useMemo, useState } from 'react';
import { commonCa, commonEn, commonEs } from '@workspace/i18n';

import { flattenObject, groupBySection } from 'admin/pages/TranslationsUiPage/translations-ui.utils';
import type {
  SupportedLanguage,
  UiLabelSectionData,
} from 'admin/pages/TranslationsUiPage/TranslationsUiPage.types';
import { EndpointHelper } from 'api/api.endpoints';

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

const buildSectionsFromTranslations = (supportedLanguages: SupportedLanguage[]) => {
  const translationData = {
    'en-GB': (commonEn as any)?.default || commonEn,
    'es-ES': (commonEs as any)?.default || commonEs,
    'ca-ES': (commonCa as any)?.default || commonCa,
  };

  if (!translationData['en-GB']?.ui || !translationData['es-ES']?.ui || !translationData['ca-ES']?.ui) {
    console.error('Missing UI translations in common files', translationData);
    return [];
  }

  const flattenedTranslations: Record<string, Record<string, any>> = {};

  for (const [langCode, translation] of Object.entries(translationData)) {
    flattenedTranslations[langCode] = translation?.ui ? flattenObject(translation.ui) : {};
  }

  const sections = groupBySection(flattenedTranslations['en-GB']);

  const sectionTitles: Record<string, { title: string; description: string }> = {
    buttons: {
      title: 'UI Buttons',
      description: 'Labels for buttons throughout the application',
    },
    forms: {
      title: 'Form Elements',
      description: 'Labels, placeholders, and validation messages for forms',
    },
    navigation: {
      title: 'Navigation',
      description: 'Navigation menu items and links',
    },
    states: {
      title: 'Application States',
      description: 'Loading, error, success, and other state messages',
    },
    actions: {
      title: 'User Actions',
      description: 'Confirmation dialogs and action-related messages',
    },
  };

  const processedSections: UiLabelSectionData[] = [];

  for (const [sectionKey, sectionItems] of Object.entries(sections)) {
    const items = Object.keys(sectionItems).map((itemKey) => {
      const values: Record<string, string> = {};

      for (const language of supportedLanguages) {
        const fullKey = `${sectionKey}.${itemKey}`;
        values[language.isoCode] = flattenedTranslations[language.isoCode]?.[fullKey] || '';
      }

      return {
        key: itemKey,
        values,
      };
    });

    const sectionInfo = sectionTitles[sectionKey] || {
      title: sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1),
      description: `${sectionKey} related translations`,
    };

    processedSections.push({
      key: sectionKey,
      title: sectionInfo.title,
      description: sectionInfo.description,
      items: items.sort((a, b) => a.key.localeCompare(b.key)),
    });
  }

  return processedSections.sort((a, b) => a.key.localeCompare(b.key));
};

export const useUiLabelSections = () => {
  const supportedLanguages = useMemo(() => SUPPORTED_LANGUAGES, []);

  const processedSections = useMemo(
    () => buildSectionsFromTranslations(supportedLanguages),
    [supportedLanguages],
  );

  const [sections, setSections] = useState<UiLabelSectionData[]>([]);
  const [initialSections, setInitialSections] = useState<UiLabelSectionData[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (processedSections.length > 0) {
      const clonedSections = processedSections.map(cloneSection);
      setSections(clonedSections);
      setInitialSections(processedSections.map(cloneSection));
      setIsReady(true);
    }
  }, [processedSections]);

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
