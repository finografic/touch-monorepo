import React, { memo } from 'react';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Flex } from '@radix-ui/themes';

import { TranslationSection } from './TranslationSection';

interface SupportedLanguage {
  isoCode: string;
  displayName: string;
  nativeName: string;
}

interface TranslationFormProps {
  supportedLanguages: SupportedLanguage[];
}

export const TranslationForm: React.FC<TranslationFormProps> = memo(({ supportedLanguages }) => {
  const { t } = useTranslation();
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <Flex direction="column" gap="6">
      <TranslationSection
        title={t('admin.pages.translations.content.drinkSubtypes.title')}
        description={t('admin.pages.translations.content.drinkSubtypes.description')}
        fieldName="drinkSubtypes"
        errors={errors.drinkSubtypes}
        supportedLanguages={supportedLanguages}
      />

      <TranslationSection
        title={t('admin.pages.translations.content.volumes.title')}
        description={t('admin.pages.translations.content.volumes.description')}
        fieldName="volumes"
        errors={errors.volumes}
        supportedLanguages={supportedLanguages}
      />

      <TranslationSection
        title={t('admin.pages.translations.content.drinkTypes.title')}
        description={t('admin.pages.translations.content.drinkTypes.description')}
        fieldName="drinkTypes"
        errors={errors.drinkTypes}
        supportedLanguages={supportedLanguages}
      />

      <TranslationSection
        title={t('admin.pages.translations.content.containerTypes.title')}
        description={t('admin.pages.translations.content.containerTypes.description')}
        fieldName="containerTypes"
        errors={errors.containerTypes}
        supportedLanguages={supportedLanguages}
      />
    </Flex>
  );
});
