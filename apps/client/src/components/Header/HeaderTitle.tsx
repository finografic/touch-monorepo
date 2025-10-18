import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { Flex } from '@radix-ui/themes';

import { useAdmin } from 'providers/AdminProvider';
import { useAppConfig } from 'providers/AppConfigProvider';
import { useAuth } from 'providers/AuthProvider/AuthContext';
import type { Theme } from 'types/ui.types';

export const HeaderTitle: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useAppConfig();
  const { user, isAuthenticated } = useAuth();

  const { isLanguageDialogOpen, setIsLanguageDialogOpen } = useAdmin();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <Flex direction="column" justify="end" align="center">
      <h1
        onClick={() => {
          navigate('/');
          window.location.reload();
        }}
      >
        {t('app.title')} <span className="current-language">({currentLanguage})</span>
      </h1>
      {/* <pre className="current-language">{String(currentSessionId)}</pre> */}
    </Flex>
  );
};
