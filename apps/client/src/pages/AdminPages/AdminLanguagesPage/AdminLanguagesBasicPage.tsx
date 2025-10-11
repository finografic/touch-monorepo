import React from 'react';
import { Box } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { AdminContentLayout, AdminSection } from '../shared';
import { styles } from './AdminLanguagesPage.styles';
import { LanguageSelector } from 'components/LanguageSelector/LanguageSelector';

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
