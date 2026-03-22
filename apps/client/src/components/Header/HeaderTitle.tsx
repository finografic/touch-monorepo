import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { Flex } from 'styled-system/jsx';

import { useAppConfig } from 'providers/AppConfigProvider';

import type { Theme } from 'types/ui.types';

export const HeaderTitle: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useAppConfig();
  const { pathname } = useLocation();
  const isAdminArea = pathname.includes('/admin');

  return (
    <Flex direction="column" justify="end" align="center">
      <h1>
        {isAdminArea ? t('admin.metadata.title') : t('app.metadata.title')}
        <span className="title-subtitle">({currentLanguage})</span>
      </h1>
    </Flex>
  );
};
