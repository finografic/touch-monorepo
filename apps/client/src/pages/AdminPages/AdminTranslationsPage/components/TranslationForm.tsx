import React, { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Flex, Heading, Text, TextField } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
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
        title={t('components.admin.translation.drinkSubtypes.title')}
        description={t('components.admin.translation.drinkSubtypes.description')}
        fieldName="drinkSubtypes"
        errors={errors.drinkSubtypes}
        supportedLanguages={supportedLanguages}
      />

      <TranslationSection
        title={t('components.admin.translation.volumes.title')}
        description={t('components.admin.translation.volumes.description')}
        fieldName="volumes"
        errors={errors.volumes}
        supportedLanguages={supportedLanguages}
      />

      <TranslationSection
        title={t('components.admin.translation.drinkTypes.title')}
        description={t('components.admin.translation.drinkTypes.description')}
        fieldName="drinkTypes"
        errors={errors.drinkTypes}
        supportedLanguages={supportedLanguages}
      />

      <TranslationSection
        title={t('components.admin.translation.containerTypes.title')}
        description={t('components.admin.translation.containerTypes.description')}
        fieldName="containerTypes"
        errors={errors.containerTypes}
        supportedLanguages={supportedLanguages}
      />
    </Flex>
  );
});
