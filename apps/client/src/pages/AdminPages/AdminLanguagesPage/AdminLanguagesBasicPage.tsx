import React from 'react';
import { Box } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { AdminContentLayout, AdminSection } from '../shared';
import { styles } from './AdminLanguagesPage.styles';
import { LanguageSelector } from 'components/LanguageSelector/LanguageSelector';

export const AdminLanguagesBasicPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section css={styles} id="admin-languages" className="admin-content-page">
      <AdminContentLayout
        // title={t('admin.pages.languages.title')}
        // subtitle={t('admin.pages.languages.subtitle')}
        title="Languages (Default)"
        subtitle="Select a language"
      >
        <AdminSection>
          <Box className="selected-section" mb="6">
            <LanguageSelector />
          </Box>
        </AdminSection>
      </AdminContentLayout>
    </section>
  );
};
