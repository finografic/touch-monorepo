import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Callout, Flex, Heading, Spinner, Text } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { TranslationForm } from './components/TranslationForm';
import { AdminContentLayout, AdminSection } from '../shared';
import { styles } from './AdminTranslationsPage.styles';
import { useBatchUpdateTranslations, useGetAllTranslations } from 'api/hooks/useTranslations';

import {
  compareTranslationItems,
  ensureLanguageFields,
  getLanguageCodesFromData,
} from './utils/translation-helpers';
import type {
  ContainerTypeUpdate,
  DrinkSubtypeUpdate,
  DrinkTypeUpdate,
  VolumeUpdate,
} from 'api/endpoints/translations.endpoints';
import { useGetSupportedLanguages } from 'queries/supported-languages';

// Keep the original schema for now - we'll handle dynamic fields in the UI
const createTranslationSchema = (t: (key: string) => string) =>
  z.object({
    drinkSubtypes: z.array(
      z.object({
        id: z.string(),
        name: z.string().min(1, t('ui.forms.validation.required')),
        nameEn: z.string().min(1, t('ui.forms.validation.required')),
        nameEs: z.string().min(1, t('ui.forms.validation.required')),
        nameCat: z.string().min(1, t('ui.forms.validation.required')),
        drinkTypeId: z.string(),
        isActive: z.boolean().optional(),
      }),
    ),
    volumes: z.array(
      z.object({
        id: z.string(),
        name: z.string().min(1, t('ui.forms.validation.required')),
        nameEn: z.string().min(1, t('ui.forms.validation.required')),
        nameEs: z.string().min(1, t('ui.forms.validation.required')),
        nameCat: z.string().min(1, t('ui.forms.validation.required')),
        isActive: z.boolean().optional(),
      }),
    ),
    drinkTypes: z.array(
      z.object({
        id: z.string(),
        name: z.string().min(1, t('ui.forms.validation.required')),
        nameEn: z.string().min(1, t('ui.forms.validation.required')),
        nameEs: z.string().min(1, t('ui.forms.validation.required')),
        nameCat: z.string().min(1, t('ui.forms.validation.required')),
        hasSubtypes: z.boolean().optional(),
        isActive: z.boolean().optional(),
      }),
    ),
    containerTypes: z.array(
      z.object({
        id: z.string(),
        name: z.string().min(1, t('ui.forms.validation.required')),
        nameEn: z.string().min(1, t('ui.forms.validation.required')),
        nameEs: z.string().min(1, t('ui.forms.validation.required')),
        nameCat: z.string().min(1, t('ui.forms.validation.required')),
        thermalConductivity: z.number().optional(),
        isActive: z.boolean().optional(),
      }),
    ),
  });

type TranslationFormData = z.infer<ReturnType<typeof createTranslationSchema>>;

// Helper function to get field name for a language
const getLanguageFieldName = (isoCode: string) => {
  return `name${isoCode.charAt(0).toUpperCase()}${isoCode.slice(1)}`;
};

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

export const AdminTranslationsPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: translationsData, isLoading, isError, error } = useGetAllTranslations();
  const { data: supportedLanguagesData, isLoading: languagesLoading } = useGetSupportedLanguages();
  const batchUpdateMutation = useBatchUpdateTranslations();
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );
  const [isDataReady, setIsDataReady] = useState(false);

  // Track if form has been initialized to prevent re-initialization
  const isInitialized = useRef(false);

  // Use supported languages or fallback to default
  const supportedLanguages = useMemo(() => {
    return (
      supportedLanguagesData || [
        { isoCode: 'en', displayName: 'English', nativeName: 'English' },
        { isoCode: 'es', displayName: 'Spanish', nativeName: 'Español' },
        { isoCode: 'cat', displayName: 'Catalan', nativeName: 'Català' },
      ]
    );
  }, [supportedLanguagesData]);

  // Memoize default values to prevent unnecessary re-renders
  const defaultValues = useMemo(() => getEmptyFormData(), []);

  // Create schema with translations
  const translationSchema = useMemo(() => createTranslationSchema(t), [t]);

  const methods = useForm<TranslationFormData>({
    resolver: zodResolver(translationSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  // Add delay to ensure data is fully loaded before showing the form
  useEffect(() => {
    if (translationsData && !isLoading && supportedLanguagesData && !languagesLoading) {
      // Small delay to ensure all data is properly loaded
      const timer = setTimeout(() => {
        setIsDataReady(true);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setIsDataReady(false);
    }
  }, [translationsData, isLoading, supportedLanguagesData, languagesLoading]);

  // Update form when data is loaded from API - prevent infinite loop
  useEffect(() => {
    if (translationsData && isDataReady && !isInitialized.current) {
      methods.reset(translationsData);
      isInitialized.current = true;
    }
  }, [translationsData, isDataReady, methods]);

  // Memoized reset function to prevent re-renders
  const handleReset = useCallback(() => {
    if (translationsData) {
      methods.reset(translationsData);
      isInitialized.current = true; // Mark as initialized after manual reset
    }
  }, [translationsData, methods.reset]);

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

              const changes: DrinkTypeUpdate = {};
              if (item.name !== original.name) changes.name = item.name;
              if (item.nameEn !== original.nameEn) changes.nameEn = item.nameEn;
              if (item.nameEs !== original.nameEs) changes.nameEs = item.nameEs;
              if (item.nameCat !== original.nameCat) changes.nameCat = item.nameCat;

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

              const changes: DrinkSubtypeUpdate = {};
              if (item.name !== original.name) changes.name = item.name;
              if (item.nameEn !== original.nameEn) changes.nameEn = item.nameEn;
              if (item.nameEs !== original.nameEs) changes.nameEs = item.nameEs;
              if (item.nameCat !== original.nameCat) changes.nameCat = item.nameCat;

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

              const changes: VolumeUpdate = {};
              if (item.name !== original.name) changes.name = item.name;
              if (item.nameEn !== original.nameEn) changes.nameEn = item.nameEn;
              if (item.nameEs !== original.nameEs) changes.nameEs = item.nameEs;
              if (item.nameCat !== original.nameCat) changes.nameCat = item.nameCat;

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

              const changes: ContainerTypeUpdate = {};
              if (item.name !== original.name) changes.name = item.name;
              if (item.nameEn !== original.nameEn) changes.nameEn = item.nameEn;
              if (item.nameEs !== original.nameEs) changes.nameEs = item.nameEs;
              if (item.nameCat !== original.nameCat) changes.nameCat = item.nameCat;

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
          setSubmitMessage({ type: 'success', message: t('notifications.orderReady') });
          console.log('Translations updated successfully');
        } else {
          setSubmitMessage({ type: 'success', message: t('ui.states.saved') });
          console.log('No changes to save');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : t('ui.states.error');
        setSubmitMessage({ type: 'error', message: `${t('ui.states.error')}: ${errorMessage}` });
        console.error('Failed to update translations:', error);
      }

      // Clear message after 5 seconds
      setTimeout(() => setSubmitMessage(null), 5000);
    },
    [translationsData, batchUpdateMutation.mutateAsync, t],
  );

  // Memoize the form content to prevent unnecessary re-renders - MOVED BEFORE EARLY RETURNS
  const formContent = useMemo(
    () => (
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Flex direction="column" gap="8">
          <TranslationForm supportedLanguages={supportedLanguages} />

          <Flex justify="center" gap="4">
            <Button type="button" variant="soft" color="gray" onClick={handleReset}>
              {t('ui.buttons.reset')}
            </Button>
            <Button
              type="submit"
              variant="solid"
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

  if (isLoading || languagesLoading || !isDataReady) {
    return (
      <AdminContentLayout
        title={t('pages.admin.title')}
        subtitle={t('components.admin.translation.editTables')}
        isLoading={true}
      >
        <Flex direction="column" gap="4" align="center" justify="center" p="6">
          <Spinner size="3" />
          <Text>{isLoading ? t('ui.states.loading') : 'Loading supported languages...'}</Text>
        </Flex>
      </AdminContentLayout>
    );
  }

  if (isError) {
    return (
      <AdminContentLayout
        title={t('pages.admin.title')}
        subtitle={t('components.admin.translation.editTables')}
        error={error?.message || t('ui.states.error')}
      >
        <Flex direction="column" gap="4" align="center" justify="center" p="6">
          <Text color="red" size="4">
            {t('ui.states.error')}: {error?.message || t('ui.states.error')}
          </Text>
        </Flex>
      </AdminContentLayout>
    );
  }

  return (
    <section id="admin-translations" className="admin-content-page">
      <FormProvider {...methods}>
        <AdminContentLayout
          title={t('pages.admin.title')}
          subtitle={t('components.admin.translation.editTables')}
          message={
            submitMessage
              ? {
                  type: submitMessage.type,
                  content: submitMessage.message,
                }
              : undefined
          }
        >
          <AdminSection>{formContent}</AdminSection>
        </AdminContentLayout>
      </FormProvider>
    </section>
  );
};
