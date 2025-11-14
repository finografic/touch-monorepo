import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from '@radix-ui/themes';

import { useAppConfig } from 'providers/AppConfigProvider';

import type { Theme } from 'types/ui.types';

export const HeaderTitle: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useAppConfig();

  return (
    <Flex direction="column" justify="end" align="center">
      <h1>
        {t('app.title')} <span className="title-subtitle">({currentLanguage})</span>
      </h1>
    </Flex>
  );
};
