import type { ReactNode } from 'react';
import React, { useMemo } from 'react';
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

import type { BreakpointMap } from 'styles/viewport/viewport.types';
import { styles } from './Header.styles';

interface HeaderColumnWidths {
  left: BreakpointMap<number>;
  center: BreakpointMap<number>;
  right: BreakpointMap<number>;
}

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
  const isAdmin = location.pathname.startsWith('/admin');
  // const { isLanguageDialogOpen, setIsLanguageDialogOpen } = useAdmin();

  // NEW: Intelligent responsive column system [Claude v3.5]
  const { left, center, right } = useMemo((): HeaderColumnWidths => {
    log('🚹 USER:', 'skyblue', { isAuthenticated, role: user?.role }, user);

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
  }, [user]);

  // ✅ Guard clause pattern - clean separation of logic and JSX
  const getLeftContent = (): ReactNode => {
    if (titleAlign === 'left') return <HeaderTitle />;
    if (toolbar && toolbarAlign === 'left') return toolbar;
    return null;
  };

  const getCenterContent = (): ReactNode => {
    if (titleAlign === 'center') return <HeaderTitle />;
    return null;
  };

  const getRightContent = (): ReactNode => {
    if (titleAlign === 'right') return <HeaderTitle />;
    if (toolbar && toolbarAlign === 'right') return toolbar;
    return null;
  };

  return (
    <div css={styles}>
      <header className={clsx('app-header', { 'admin-app-header': isAdmin })}>
        <Container className="container" fluid>
          <Row justify="between" align="center">
            {/* LEFT column - responsive width */}
            <Col {...left} className="col col-header-left">
              <Flex justify="start">{getLeftContent()}</Flex>
            </Col>

            {/* CENTER column - responsive width */}
            <Col {...center} className="col col-header-center">
              <Flex justify="center">{getCenterContent()}</Flex>
            </Col>

            {/* RIGHT column - responsive width */}
            <Col {...right} className="col col-header-right">
              <Flex justify="end">{getRightContent()}</Flex>
            </Col>
          </Row>
        </Container>
      </header>
    </div>
  );
};
