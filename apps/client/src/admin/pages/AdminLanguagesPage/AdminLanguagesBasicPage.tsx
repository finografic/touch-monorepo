import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@radix-ui/themes';

import { LanguageSelector } from 'components/LanguageSelector/LanguageSelector';
import { AdminContentLayout, AdminSection } from '../..';
import { styles } from './AdminLanguagesPage.styles';

export const AdminLanguagesBasicPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AdminContentLayout
      title={t('admin.pages.languages.title')}
      description={t('admin.pages.languages.subtitle')}
      css={styles}
    >
      <AdminSection>
        <Box className="selected-section" mb="6">
          <LanguageSelector />
        </Box>
      </AdminSection>
    </AdminContentLayout>
  );
};
