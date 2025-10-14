import React from 'react';
import type { ReactNode } from 'react';
import { Callout, Flex, Heading, Text } from '@radix-ui/themes';
import { styles } from './Title.styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from 'providers/AppConfigProvider';
import { Col, Container, Row } from 'react-grid-system';
import clsx from 'clsx';
import { useAdmin } from 'providers/AdminProvider';
import type { Theme } from 'types/ui.types';
import type { SerializedStyles } from '@emotion/react';
import { useAuth } from 'providers/AuthProvider/AuthContext';

interface TitleProps {
  align?: 'left' | 'center';
  title: string;
  detail?: string;
  subtitle?: string;
  description?: string;
  // children: ReactNode;
  message?: {
    type: 'success' | 'error' | 'warning' | 'info';
    content: string;
  };
  isLoading?: boolean;
  error?: string;
  css?: SerializedStyles;
}

export const Title: React.FC<TitleProps> = ({
  align = 'left',
  title,
  detail,
  subtitle,
  description,
  // children,
  message,
  isLoading = false,
  error,
  css,
}) => {
  // const { t } = useTranslation();
  // const { theme } = useAppConfig();
  // const navigate = useNavigate();
  // const location = useLocation();
  // const { currentLanguage } = useAppConfig();
  // const { user, isAuthenticated } = useAuth();

  // const { isLanguageDialogOpen, setIsLanguageDialogOpen } = useAdmin();
  // const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div css={styles}>
      <header className={clsx('title-wrapper', { align })}>
        <Heading size="8" className="title" align={align}>
          {title}
          {subtitle && (
            <span className="title-subtitle" style={{ opacity: 0.5 }}>
              {' '}
              : {subtitle}
            </span>
          )}
        </Heading>
        {description && (
          <div className="title-description">
            <Text>{description}</Text>
          </div>
        )}
      </header>
    </div>
  );
};
