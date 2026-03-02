import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from 'styled-system/jsx';
import { LanguageSelector } from 'components/LanguageSelector/LanguageSelector';

import { AdminPageLayout, AdminSection } from '../..';
import { styles } from './AdminLanguagesPage.styles';

export const PublicLanguagesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AdminPageLayout
      title={t('admin.pages.languages_public.title')}
      subtitle={t('admin.pages.languages_public.subtitle', { defaultValue: '' })}
      description={t('admin.pages.languages_public.description', { defaultValue: '' })}
      styles={styles}
    >
      <AdminSection>
        <Box className="selected-section" mb={6}>
          <LanguageSelector />
        </Box>
      </AdminSection>
    </AdminPageLayout>
  );
};
