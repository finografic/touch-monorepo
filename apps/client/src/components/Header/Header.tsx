import type { ReactNode } from 'react';
import React from 'react';
import { Col, Container, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { Flex } from '@radix-ui/themes';
import clsx from 'clsx';
import { HeaderTitle } from 'components/Header/HeaderTitle';
import { useAdmin } from 'providers/AdminProvider';
import { useAppConfig } from 'providers/AppConfigProvider';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import type { Theme } from 'types/ui.types';

import { styles } from './Header.styles';

type HeaderProps =
  | {
      titleAlign?: 'center' | 'left';
      toolbarAlign: 'right';
      toolbar: ReactNode;
    }
  | {
      titleAlign?: 'center' | 'right';
      toolbarAlign: 'left';
      toolbar: ReactNode;
    };

export const Header: React.FC<HeaderProps> = ({
  titleAlign = 'center',
  toolbarAlign = 'right',
  toolbar = <React.Fragment />,
}) => {
  const { t } = useTranslation();
  const { theme } = useAppConfig();
  const navigate = useNavigate();
  const location = useLocation();
  // const { currentSessionId } = useSession();
  // const { currentLanguage } = useAppConfig();
  // const { isNextDisabled } = usePagination();

  const { user, isAuthenticated } = useAuth();

  console.log('🔍 USER:', user);
  console.log('%c🔍 IS AUTHENTICATED:', 'color:yellow', isAuthenticated);
  // const { isLanguageDialogOpen, setIsLanguageDialogOpen } = useAdmin();

  const isAdmin = location.pathname.startsWith('/admin');

  // NEW: Intelligent responsive column system [Claude v3.5]
  const getColumnProps = () => {
    // NOTE: (empty) | (title) | (toolbar)
    if (titleAlign === 'center') {
      return {
        left: { xs: 2, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 },
        center: { xs: 8, sm: 8, md: 6, lg: 6, xl: 6, xxl: 6 },
        right: { xs: 2, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 },
      };
    }
    // NOTE: (title) | (empty) | (toolbar)
    if (titleAlign === 'left') {
      return {
        left: { xs: 6, sm: 6, md: 4, lg: 4, xl: 4, xxl: 4 },
        center: { xs: 0, sm: 0, md: 4, lg: 4, xl: 4, xxl: 4 },
        right: { xs: 6, sm: 6, md: 4, lg: 4, xl: 4, xxl: 4 },
      };
    }
    // NOTE: (empty) | (empty) | (title + toolbar)
    return {
      left: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 },
      center: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 },
      right: { xs: 8, sm: 8, md: 8, lg: 8, xl: 8, xxl: 8 },
    };
  };

  const { left: leftColProps, center: centerColProps, right: rightColProps } = getColumnProps();

  return (
    <div css={styles}>
      <header className={clsx('app-header', { 'admin-app-header': isAdmin })}>
        <Container className="container" fluid>
          <Row justify="between" align="center">
            {/*
              LEFT column - responsive width
            */}
            <Col {...leftColProps} className="col col-header-left">
              <Flex justify="start">
                {titleAlign === 'left' ? (
                  <HeaderTitle />
                ) : toolbar && toolbarAlign === 'left' ? (
                  toolbar
                ) : (
                  <React.Fragment />
                )}
              </Flex>
            </Col>
            {/*
              CENTER column - responsive width
            */}
            <Col {...centerColProps} className="col col-header-center">
              <Flex justify="center">{titleAlign === 'center' && <HeaderTitle />}</Flex>
            </Col>
            {/*
              RIGHT column - responsive width
            */}
            <Col {...rightColProps} className="col col-header-right">
              <Flex justify="end">
                {titleAlign === 'right' ? (
                  <HeaderTitle />
                ) : toolbar && toolbarAlign === 'right' ? (
                  toolbar
                ) : (
                  <React.Fragment />
                )}
              </Flex>
            </Col>
          </Row>
        </Container>
      </header>
    </div>
  );
};
