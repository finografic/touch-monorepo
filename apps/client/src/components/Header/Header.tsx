import React from 'react';
import type { ReactNode } from 'react';
import { Box, Container, Flex } from '@radix-ui/themes';
import { styles } from './Header.styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import { useSession } from 'providers/SessionProvider/SessionContext';
import { ThemeToggle } from 'components/ThemeToggle';
import { useAppConfig } from 'providers/AppConfigProvider';
// import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { LoginButton } from 'components/Dialog/dialogs/AuthLoginSimpleDialog/LoginButton';
import { Col, Row } from 'react-grid-system';
import { useAuth } from 'providers/AuthProvider/AuthContext';
import clsx from 'clsx';

interface HeaderProps {
  titleAlign?: 'left' | 'center';
  navigation?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ titleAlign = 'center', navigation = <React.Fragment /> }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  // const { currentSessionId } = useSession();
  const { currentLanguage } = useAppConfig();
  // const { isNextDisabled } = usePagination();

  const isAdmin = location.pathname.startsWith('/admin');
  log('__DEV: navigation', 'hotpink', isAdmin);

  // const { user, session, isLoading, isAuthenticated, isAdmin, signOut } = useAuth();

  // console.log('🔍 USER:', user);
  // console.log('🔍 SESSION:', session);
  // console.log('🔍 IS LOADING:', isLoading);
  // console.log('🔍 IS AUTHENTICATED:', isAuthenticated);
  // console.log('🔍 IS ADMIN:', isAdmin);
  // console.log('🔍 SIGN OUT:', signOut);

  const HeaderTitle = () => {
    return (
      <Flex direction="column" justify="end" align="center" style={{ flex: '6' }}>
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

  return (
    <div css={styles}>
      <header className={clsx('app-header', { 'admin-header': isAdmin })}>
        <Container size="4" className="container">
          <Row justify="between" align="center">
            {/* <Flex justify="between" align="center" width="100%" className="row-header"> */}
            {/* ====================================================================== */}
            <Col xs={3} style={{ flex: '4' }} className="col col-header-left">
              {titleAlign === 'left' && <HeaderTitle />}
            </Col>

            {/* Center column - 6 parts */}
            <Col xs={6} style={{ flex: '6' }} className="col col-header-center">
              {titleAlign === 'center' && <HeaderTitle />}
            </Col>

            <Col xs={3} style={{ flex: '4' }} className="col col-header-right">
              <Box className="button-box">
                <LoginButton />
              </Box>
              <Box className="button-box">
                <ThemeToggle />
              </Box>

              {/* <LanguageSelector onLanguageChange={handleLanguageChange} /> */}
              {/* <pre className="current-language">{String(currentSessionId)}</pre> */}
            </Col>
            {/* </Flex> */}
          </Row>
        </Container>
      </header>
      {navigation}
    </div>
  );
};
