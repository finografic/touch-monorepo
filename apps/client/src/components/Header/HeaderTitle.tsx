import React from 'react';
import { Flex } from '@radix-ui/themes';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from 'providers/AppConfigProvider';
import { useAdmin } from 'providers/AdminProvider';
import type { Theme } from 'types/ui.types';
import { useAuth } from 'providers/AuthProvider/AuthContext';

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
