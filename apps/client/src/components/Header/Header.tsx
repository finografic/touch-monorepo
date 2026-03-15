import type { ReactNode } from 'react';
import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Container, Row } from '@finografic/design-system/grid';
import type { BreakpointMap } from '@finografic/design-system/viewport';
import type { AuthRoles, AuthSessionData, AuthUser } from '@workspace/shared/auth';

import clsx from 'clsx';
import { Flex } from 'styled-system/jsx';
import { HeaderTitle } from 'components/Header/HeaderTitle';

import { useAuth } from 'providers/AuthProvider/AuthContext';

import type { Theme } from 'types/ui.types';
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
  const location = useLocation();
  const { user, isAuthenticated, session } = useAuth();

  useEffect(() => {
    user && log('🚹 USER:', 'skyblue', { isAuthenticated, role: user?.role, session }, user);
  }, [isAuthenticated, user?.role, user]);

  const { left, center, right } = useMemo((): HeaderColumnWidths => {
    if (titleAlign === 'center') {
      return {
        // empty | title | toolbar
        left: { 'xs': 2, 'sm': 2, 'md': 3, 'lg': 3, 'xl': 3, '2xl': 3 },
        center: { 'xs': 8, 'sm': 8, 'md': 6, 'lg': 6, 'xl': 6, '2xl': 6 },
        right: { 'xs': 2, 'sm': 2, 'md': 3, 'lg': 3, 'xl': 3, '2xl': 3 },
      };
    }
    if (titleAlign === 'left') {
      return {
        // title | empty | toolbar
        left: { 'xs': 6, 'sm': 6, 'md': 4, 'lg': 4, 'xl': 4, '2xl': 4 },
        center: { 'xs': 0, 'sm': 0, 'md': 4, 'lg': 4, 'xl': 4, '2xl': 4 },
        right: { 'xs': 6, 'sm': 6, 'md': 4, 'lg': 4, 'xl': 4, '2xl': 4 },
      };
    }
    return {
      // empty | empty | title + toolbar
      left: { 'xs': 2, 'sm': 2, 'md': 2, 'lg': 2, 'xl': 2, '2xl': 2 },
      center: { 'xs': 2, 'sm': 2, 'md': 2, 'lg': 2, 'xl': 2, '2xl': 2 },
      right: { 'xs': 8, 'sm': 8, 'md': 8, 'lg': 8, 'xl': 8, '2xl': 8 },
    };
  }, [user]);

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
      <header className={clsx('app-header', { 'admin-app-header': location.pathname.startsWith('/admin') })}>
        <Container className="container" fluid>
          <Row justify="space-between" align="center">
            <Col {...left} className="col col-header-left">
              <Flex justify="start">{getLeftContent()}</Flex>
            </Col>
            <Col {...center} className="col col-header-center">
              <Flex justify="center">{getCenterContent()}</Flex>
            </Col>
            <Col {...right} className="col col-header-right">
              <Flex justify="end">{getRightContent()}</Flex>
            </Col>
          </Row>
        </Container>
      </header>
    </div>
  );
};
