import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
// Import the common translation files directly (these contain the UI translations)
import { commonCa, commonEn, commonEs } from '@workspace/i18n';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Flex, Spinner, Text } from '@radix-ui/themes';
import { EndpointHelper } from 'api/api.endpoints';
import { z } from 'zod';

import { AdminContentLayout, AdminSection, UiLabelSection } from '../..';
import { styles } from './AdminUiLabelsPage.styles';

interface SupportedLanguage {
  isoCode: string;
  displayName: string;
  nativeName: string;
}

interface UiLabelItem {
  key: string;
  values: Record<string, string>;
}

interface UiLabelSectionData {
  key: string;
  title: string;
  description: string;
  items: UiLabelItem[];
}

// Create schema for form validation
const createUiLabelsSchema = (t: any) => {
  return z.object({
    sections: z.array(
      z.object({
        key: z.string(),
        items: z.array(
          z.object({
            key: z.string(),
            values: z.record(z.string()),
          }),
        ),
      }),
    ),
  });
};

type UiLabelsFormData = z.infer<ReturnType<typeof createUiLabelsSchema>>;

// Helper function to flatten nested objects with dot notation
const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
  const flattened: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  }

  return flattened;
};

// Helper function to group flattened keys by their first level (since we already extracted 'ui')
const groupBySection = (flattenedData: Record<string, any>): Record<string, Record<string, any>> => {
  const sections: Record<string, Record<string, any>> = {};

  for (const [key, value] of Object.entries(flattenedData)) {
    const pathParts = key.split('.');
    if (pathParts.length >= 2) {
      const sectionKey = pathParts[0]; // buttons, forms, navigation, etc.
      const itemKey = pathParts.slice(1).join('.'); // The rest of the path

      if (!sections[sectionKey]) {
        sections[sectionKey] = {};
      }
      sections[sectionKey][itemKey] = value;
    }
  }

  return sections;
};

export const AdminUiLabelsPage: React.FC = () => {
  const { t } = useTranslation();
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );
  const [uiLabelData, setUiLabelData] = useState<UiLabelSectionData[]>([]);
  const [isDataReady, setIsDataReady] = useState(false);

  // Verify translations are loaded (handle _default suffix from bundling)
  const enGBData = (commonEn as any)?.default || commonEn;
  const esESData = (commonEs as any)?.default || commonEs;
  const caESData = (commonCa as any)?.default || commonCa;

  if (!enGBData?.ui || !esESData?.ui || !caESData?.ui) {
    console.error('Missing UI translations in common files');
    console.error('enGBData:', enGBData);
    console.error('esESData:', esESData);
    console.error('caESData:', caESData);
  }

  // Supported languages - these match the actual translation files
  // Reordered to put English as second column
  const supportedLanguages: SupportedLanguage[] = useMemo(
    () => [
      { isoCode: 'es-ES', displayName: 'Spanish', nativeName: 'Español' },
      { isoCode: 'en-GB', displayName: 'English', nativeName: 'English' },
      { isoCode: 'ca-ES', displayName: 'Catalan', nativeName: 'Català' },
    ],
    [],
  );

  // Process translation files into sections
  const processedSections = useMemo(() => {
    console.log('Starting processing...');
    console.log('commonEn:', commonEn);
    console.log('commonEs:', commonEs);
    console.log('commonCa:', commonCa);

    // Handle the _default suffix that gets added during bundling
    const translationData = {
      'en-GB': (commonEn as any)?.default || commonEn,
      'es-ES': (commonEs as any)?.default || commonEs,
      'ca-ES': (commonCa as any)?.default || commonCa,
    };

    console.log('translationData:', translationData);

    // Check if any translation data is missing
    if (!translationData['en-GB'] || !translationData['es-ES'] || !translationData['ca-ES']) {
      console.error('Some translation data is missing:', translationData);
      return [];
    }

    // Check specifically for UI sections
    console.log('en-GB ui:', translationData['en-GB']?.ui);
    console.log('es-ES ui:', translationData['es-ES']?.ui);
    console.log('ca-ES ui:', translationData['ca-ES']?.ui);

    // Flatten each language's UI translations
    const flattenedTranslations: Record<string, Record<string, any>> = {};
    for (const [langCode, translation] of Object.entries(translationData)) {
      if (translation?.ui) {
        console.log(`Flattening UI for ${langCode}:`, translation.ui);
        flattenedTranslations[langCode] = flattenObject(translation.ui);
        console.log(`Flattened result for ${langCode}:`, flattenedTranslations[langCode]);
      } else {
        console.warn(`No UI property found for ${langCode}`, translation);
        flattenedTranslations[langCode] = {};
      }
    }

    console.log('All flattened translations:', flattenedTranslations);

    // Group by sections using English as the base
    const sections = groupBySection(flattenedTranslations['en-GB']);
    console.log('sections after grouping:', sections);
    console.log('sections keys:', Object.keys(sections));
    console.log('sections length:', Object.keys(sections).length);

    const processedSections: UiLabelSectionData[] = [];

    for (const [sectionKey, sectionItems] of Object.entries(sections)) {
      const items: UiLabelItem[] = [];

      for (const [itemKey, _] of Object.entries(sectionItems)) {
        const values: Record<string, string> = {};

        // Get the value for each language
        for (const langCode of supportedLanguages.map((l) => l.isoCode)) {
          const flattenedForLang = flattenedTranslations[langCode];
          // The flattened key should be the full path: sectionKey.itemKey
          const fullItemKey = `${sectionKey}.${itemKey}`;
          values[langCode] = flattenedForLang[fullItemKey] || '';

          // Debug: log the key lookup
          if (sectionKey === 'buttons' && itemKey === 'save') {
            console.log(`Looking for key "${fullItemKey}" in ${langCode}:`, flattenedForLang[fullItemKey]);
            console.log(`Available keys in ${langCode}:`, Object.keys(flattenedForLang).slice(0, 10));
            console.log(`Full flattened object for ${langCode}:`, flattenedForLang);
          }
        }

        items.push({
          key: itemKey,
          values,
        });

        // Debug: log the first few items to see if values are correct
        if (items.length <= 3) {
          console.log(`Item ${itemKey} values:`, values);
        }
      }

      // Create section with human-readable title and description
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

      const sectionInfo = sectionTitles[sectionKey] || {
        title: sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1),
        description: `${sectionKey} related translations`,
      };

      processedSections.push({
        key: sectionKey,
        title: sectionInfo.title,
        description: sectionInfo.description,
        items: items.sort((a, b) => a.key.localeCompare(b.key)), // Sort items alphabetically
      });
    }

    const result = processedSections.sort((a, b) => a.key.localeCompare(b.key)); // Sort sections alphabetically
    console.log('Final result:', result);
    console.log('Result length:', result.length);
    return result;
  }, [supportedLanguages]);

  // Create form schema
  const uiLabelsSchema = useMemo(() => createUiLabelsSchema(t), [t]);

  const methods = useForm<UiLabelsFormData>({
    resolver: zodResolver(uiLabelsSchema),
    defaultValues: {
      sections: processedSections.map((section) => ({
        key: section.key,
        items: section.items,
      })),
    },
    mode: 'onSubmit',
  });

  // Update form data when processed sections change
  useEffect(() => {
    console.log('useEffect called with processedSections:', processedSections);
    console.log('processedSections.length:', processedSections.length);

    if (processedSections.length > 0) {
      console.log('Setting data ready to true');
      setUiLabelData(processedSections);
      methods.reset({
        sections: processedSections.map((section) => ({
          key: section.key,
          items: section.items,
        })),
      });
      setIsDataReady(true);
    } else {
      console.log('processedSections is empty, staying in loading state');
    }
  }, [processedSections, methods]);

  // Handle item changes
  const handleItemChange = useCallback(
    (sectionKey: string, itemKey: string, languageCode: string, value: string) => {
      setUiLabelData((prev) =>
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

  // Handle form submission
  const onSubmit = useCallback(async (data: UiLabelsFormData) => {
    try {
      log('UI Labels data to save:', 'blue', data);

      // Call the save endpoint
      const response = await EndpointHelper.saveUiLabels(data);

      log('Save response:', 'green', response);

      setSubmitMessage({
        type: 'success',
        message: `UI Labels saved successfully! Updated ${response.filesUpdated?.length || 0} files: ${response.filesUpdated?.join(', ') || 'unknown'}`,
      });

      // Clear message after 8 seconds
      setTimeout(() => setSubmitMessage(null), 8000);
    } catch (error) {
      log('Save error:', 'red', error);
      setSubmitMessage({
        type: 'error',
        message: `Failed to save UI Labels: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });

      // Clear error message after 10 seconds
      setTimeout(() => setSubmitMessage(null), 10000);
    }
  }, []);

  const handleReset = useCallback(() => {
    methods.reset({
      sections: processedSections.map((section) => ({
        key: section.key,
        items: section.items,
      })),
    });
    setUiLabelData(processedSections);
    setSubmitMessage(null);
  }, [methods, processedSections]);

  if (!isDataReady) {
    return (
      <AdminContentLayout title={t('admin.title')} subtitle="UI Labels / Translations" isLoading={true}>
        <Flex direction="column" gap="4" align="center" justify="center" p="6">
          <Spinner size="3" />
          <Text>Loading UI translation files...</Text>
        </Flex>
      </AdminContentLayout>
    );
  }

  const formContent = (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <Flex direction="column" gap="6">
        {uiLabelData.map((section) => (
          <UiLabelSection
            key={section.key}
            title={section.title}
            description={section.description}
            items={section.items}
            supportedLanguages={supportedLanguages}
            onItemChange={(itemKey, languageCode, value) => {
              handleItemChange(section.key, itemKey, languageCode, value);
            }}
          />
        ))}

        <Flex justify="center" gap="4" pt="4">
          <Button type="button" variant="soft" color="gray" onClick={handleReset}>
            {t('ui.buttons.reset')}
          </Button>
          <Button type="submit" variant="solid" disabled={methods.formState.isSubmitting}>
            {methods.formState.isSubmitting ? t('ui.states.saving') : t('ui.buttons.save')}
          </Button>
        </Flex>
      </Flex>
    </form>
  );

  return (
    <FormProvider {...methods}>
      <AdminContentLayout
        title={t('admin.title')}
        subtitle="UI Labels / Translations"
        message={
          submitMessage
            ? {
                type: submitMessage.type,
                content: submitMessage.message,
              }
            : undefined
        }
        styles={styles}
      >
        {/* <AdminSection> */}
        {formContent}
        {/* </AdminSection> */}
      </AdminContentLayout>
    </FormProvider>
  );
};
