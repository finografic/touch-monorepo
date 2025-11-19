import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { Flex } from '@radix-ui/themes';
import type { ContainerTypeUpdate, DrinkSubtypeUpdate, DrinkTypeUpdate, VolumeUpdate } from 'api/endpoints';
import { useBatchUpdateTranslations, useGetAllTranslations } from 'api/hooks/useTranslations';
import type { z } from 'zod';
import { Button } from 'components/Button';
import { useToast } from 'components/Toast';

import { LanguagesDto, useGetSupportedLanguages } from 'queries/supported-languages';

import { AdminPageLayout, AdminSection } from '../..';
import { TranslationForm } from './components/TranslationForm';
import {
  compareTranslationItems,
  convertLegacyFieldsToTranslations,
  convertTranslationsToLegacyFields,
  ensureLanguageFields,
  getLanguageCodesFromData,
  getLanguageFieldName,
} from './utils/translation-helpers';
import { createTranslationSchema } from './translations-product.schema';
import { styles } from './TranslationsProductPage.styles';

type TranslationFormData = z.infer<ReturnType<typeof createTranslationSchema>>;

// Helper function to create empty translation object with all language fields
const createEmptyTranslationItem = (
  supportedLanguages: Array<{ isoCode: string }>,
  extraFields: Record<string, any> = {},
) => {
  const item: Record<string, any> = {
    id: '',
    name: '',
    ...extraFields,
  };

  // Add fields for each supported language
  supportedLanguages.forEach((lang) => {
    const fieldName = getLanguageFieldName(lang.isoCode);
    item[fieldName] = '';
  });

  return item;
};

// Default empty data structure - will be populated from API
const getEmptyFormData = (): TranslationFormData => ({
  drinkSubtypes: [],
  volumes: [],
  drinkTypes: [],
  containerTypes: [],
});

export const TranslationsProductPage: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: translationsData, isLoading, isError, error } = useGetAllTranslations();
  const { data: supportedLanguagesData, isLoading: languagesLoading } = useGetSupportedLanguages();
  const batchUpdateMutation = useBatchUpdateTranslations();
  const [isDataReady, setIsDataReady] = useState(false);

  // Track if form has been initialized to prevent re-initialization
  const isInitialized = useRef(false);

  // ------------------------------------------------------------------------ //

  // Use supported languages from database - don't render until loaded
  // Convert to format expected by AdminTranslationsPage (needs isoCode field)
  const supportedLanguages = useMemo(() => {
    if (!supportedLanguagesData || !Array.isArray(supportedLanguagesData)) return [];

    // Map the database format to what AdminTranslationsPage expects
    return supportedLanguagesData.map((lang) => ({
      isoCode: lang.isoCode,
      displayName: lang.displayName,
      nativeName: lang.nativeName,
    }));
  }, [supportedLanguagesData]);

  // ------------------------------------------------------------------------ //

  // Memoize default values to prevent unnecessary re-renders
  const defaultValues = useMemo(() => getEmptyFormData(), []);

  // Create schema with translations - now dynamic based on supported languages
  const translationSchema = useMemo(
    () => createTranslationSchema(t, supportedLanguages),
    [t, supportedLanguages],
  );

  const methods = useForm<TranslationFormData>({
    resolver: zodResolver(translationSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  // Add delay to ensure data is fully loaded before showing the form
  useEffect(
    function initializePageOnDataReady() {
      if (
        translationsData &&
        !isLoading &&
        supportedLanguagesData &&
        Array.isArray(supportedLanguagesData) &&
        supportedLanguagesData.length > 0 &&
        !languagesLoading
      ) {
        // Small delay to ensure all data is properly loaded
        const timer = setTimeout(() => {
          setIsDataReady(true);
        }, 100);

        return () => clearTimeout(timer);
      } else {
        setIsDataReady(false);
      }
    },
    [translationsData, isLoading, supportedLanguagesData, languagesLoading],
  );

  // Convert JSON translations to legacy field format for form compatibility
  const convertedTranslationsData = useMemo(() => {
    if (!translationsData || supportedLanguages.length === 0) return translationsData;

    return {
      drinkTypes: translationsData.drinkTypes.map((item) =>
        convertTranslationsToLegacyFields(item, supportedLanguages),
      ),
      drinkSubtypes: translationsData.drinkSubtypes.map((item) =>
        convertTranslationsToLegacyFields(item, supportedLanguages),
      ),
      volumes: translationsData.volumes.map((item) =>
        convertTranslationsToLegacyFields(item, supportedLanguages),
      ),
      containerTypes: translationsData.containerTypes.map((item) =>
        convertTranslationsToLegacyFields(item, supportedLanguages),
      ),
    };
  }, [translationsData, supportedLanguages]);

  // Update form when data is loaded from API - prevent infinite loop
  useEffect(
    function updateFormOnDataReady() {
      if (convertedTranslationsData && isDataReady && !isInitialized.current) {
        methods.reset(convertedTranslationsData);
        isInitialized.current = true;
      }
    },
    [convertedTranslationsData, isDataReady, methods],
  );

  // Memoized reset function to prevent re-renders
  const handleReset = useCallback(() => {
    if (convertedTranslationsData) {
      methods.reset(convertedTranslationsData);
      isInitialized.current = true; // Mark as initialized after manual reset
    }
  }, [convertedTranslationsData, methods.reset]);

  const onSubmit = useCallback(
    async (data: TranslationFormData) => {
      try {
        // Prepare batch update data by comparing with original data
        const updates: Parameters<typeof batchUpdateMutation.mutateAsync>[0] = {};

        // Compare and prepare drink types updates
        if (translationsData?.drinkTypes) {
          const drinkTypeUpdates = data.drinkTypes
            .map((item) => {
              const original = translationsData.drinkTypes.find((orig) => orig.id === item.id);
              if (!original) return null;

              // Convert form data (legacy fields) back to JSON format for comparison
              const convertedItem = convertLegacyFieldsToTranslations(item, supportedLanguages);

              const changes = compareTranslationItems(convertedItem, original, supportedLanguages);
              return Object.keys(changes).length > 0 ? { id: item.id, updates: changes } : null;
            })
            .filter(Boolean) as Array<{ id: string; updates: DrinkTypeUpdate }>;

          if (drinkTypeUpdates.length > 0) {
            updates.drinkTypes = drinkTypeUpdates;
          }
        }

        // Compare and prepare drink subtypes updates
        // Note: Drink subtypes are currently read-only via this interface
        if (translationsData?.drinkSubtypes) {
          const drinkSubtypeUpdates = data.drinkSubtypes
            .map((item) => {
              const original = translationsData.drinkSubtypes.find((orig) => orig.id === item.id);
              if (!original) return null;

              // Convert form data (legacy fields) back to JSON format for comparison
              const convertedItem = convertLegacyFieldsToTranslations(item, supportedLanguages);

              const changes = compareTranslationItems(convertedItem, original, supportedLanguages);
              return Object.keys(changes).length > 0 ? { id: item.id, updates: changes } : null;
            })
            .filter(Boolean) as Array<{ id: string; updates: DrinkSubtypeUpdate }>;

          if (drinkSubtypeUpdates.length > 0) {
            console.warn(
              'Drink subtype changes detected but cannot be saved directly. Please manage subtypes through drink types.',
            );
            // Don't add to updates since they can't be processed
          }
        }

        // Compare and prepare volumes updates
        if (translationsData?.volumes) {
          const volumeUpdates = data.volumes
            .map((item) => {
              const original = translationsData.volumes.find((orig) => orig.id === item.id);
              if (!original) return null;

              // Convert form data (legacy fields) back to JSON format for comparison
              const convertedItem = convertLegacyFieldsToTranslations(item, supportedLanguages);

              const changes = compareTranslationItems(convertedItem, original, supportedLanguages);
              return Object.keys(changes).length > 0 ? { id: item.id, updates: changes } : null;
            })
            .filter(Boolean) as Array<{ id: string; updates: VolumeUpdate }>;

          if (volumeUpdates.length > 0) {
            updates.volumes = volumeUpdates;
          }
        }

        // Compare and prepare container types updates
        if (translationsData?.containerTypes) {
          const containerTypeUpdates = data.containerTypes
            .map((item) => {
              const original = translationsData.containerTypes.find((orig) => orig.id === item.id);
              if (!original) return null;

              // Convert form data (legacy fields) back to JSON format for comparison
              const convertedItem = convertLegacyFieldsToTranslations(item, supportedLanguages);

              const changes = compareTranslationItems(convertedItem, original, supportedLanguages);
              return Object.keys(changes).length > 0 ? { id: item.id, updates: changes } : null;
            })
            .filter(Boolean) as Array<{ id: string; updates: ContainerTypeUpdate }>;

          if (containerTypeUpdates.length > 0) {
            updates.containerTypes = containerTypeUpdates;
          }
        }

        // Only submit if there are actual changes
        if (Object.keys(updates).length > 0) {
          await batchUpdateMutation.mutateAsync(updates);
          toast({
            variant: 'success',
            message: 'Translations updated successfully',
            subText: `Updated ${Object.keys(updates).length} section(s)`,
          });
          console.log('Translations updated successfully');
        } else {
          toast({
            variant: 'info',
            message: 'No changes to save',
            subText: 'All translations are already up to date',
          });
          console.log('No changes to save');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : t('ui.states.error');
        toast({
          variant: 'error',
          message: 'Failed to update translations',
          subText: errorMessage,
          action: {
            label: 'Retry',
            onClick: () => methods.handleSubmit(onSubmit)(),
          },
        });
        console.error('Failed to update translations:', error);
      }
    },
    [translationsData, batchUpdateMutation.mutateAsync, t, supportedLanguages, toast, methods.handleSubmit],
  );

  // Memoize the form content to prevent unnecessary re-renders - MOVED BEFORE EARLY RETURNS
  const formContent = useMemo(
    () => (
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Flex direction="column">
          <TranslationForm supportedLanguages={supportedLanguages} />
          <Flex justify="center" gap="4">
            <Button type="button" variant="outline" color="warning" onClick={handleReset}>
              {t('ui.buttons.reset')}
            </Button>
            <Button
              variant="solid"
              color="success"
              disabled={methods.formState.isSubmitting || batchUpdateMutation.isPending}
            >
              {methods.formState.isSubmitting || batchUpdateMutation.isPending
                ? t('ui.states.saving')
                : t('ui.buttons.save')}
            </Button>
          </Flex>
        </Flex>
      </form>
    ),
    [
      methods.handleSubmit,
      onSubmit,
      handleReset,
      methods.formState.isSubmitting,
      batchUpdateMutation.isPending,
      supportedLanguages,
      t,
    ],
  );

  return (
    <FormProvider {...methods}>
      <AdminPageLayout
        title={t('admin.title')}
        subtitle={t('admin.pages.translations.content.editTables')}
        isLoading={isLoading || languagesLoading || !isDataReady || supportedLanguages.length === 0}
        error={isError ? error?.message || t('ui.states.error') : undefined}
        styles={styles}
      >
        {formContent}
      </AdminPageLayout>
    </FormProvider>
  );
};
