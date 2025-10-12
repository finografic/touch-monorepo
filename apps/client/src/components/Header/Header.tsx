import React from 'react';
import type { ReactNode } from 'react';
import { Flex } from '@radix-ui/themes';
import { styles } from './Header.styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from 'providers/AppConfigProvider';
import { Col, Container, Row } from 'react-grid-system';
import clsx from 'clsx';
import { useAdmin } from 'providers/AdminProvider';
import type { Theme } from 'types/ui.types';
import { useAuth } from 'providers/AuthProvider/AuthContext';

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
  const { currentLanguage } = useAppConfig();
  // const { isNextDisabled } = usePagination();

  const { user, isAuthenticated } = useAuth();

  console.log('🔍 USER:', user);
  console.log('%c🔍 IS AUTHENTICATED:', 'color:yellow', isAuthenticated);

  const { isLanguageDialogOpen, setIsLanguageDialogOpen } = useAdmin();

  const isAdmin = location.pathname.startsWith('/admin');
  // log('__DEV: navigation', 'hotpink', isAdmin);

  // const { user, session, isLoading, isAuthenticated, isAdmin, signOut } = useAuth();

  // console.log('🔍 USER:', user);
  // console.log('🔍 SESSION:', session);
  // console.log('🔍 IS LOADING:', isLoading);
  // console.log('🔍 IS AUTHENTICATED:', isAuthenticated);
  // console.log('🔍 IS ADMIN:', isAdmin);
  // console.log('🔍 SIGN OUT:', signOut);

  const HeaderTitle = () => {
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

  return (
    <div css={styles}>
      <header className={clsx('app-header', { 'admin-app-header': isAdmin })}>
        <Container className="container">
          <Row justify="between" align="center">
            <Col xs={3} className="col col-header-left">
              {titleAlign === 'left' ? (
                <HeaderTitle />
              ) : toolbar && toolbarAlign === 'left' ? (
                toolbar
              ) : (
                <React.Fragment />
              )}
            </Col>

            {/* Center column - 6 parts */}
            <Col xs={6} className="col col-header-center">
              {titleAlign === 'center' && <HeaderTitle />}
            </Col>

            <Col xs={3} className="col col-header-right">
              {titleAlign === 'right' ? (
                <HeaderTitle />
              ) : toolbar && toolbarAlign === 'right' ? (
                toolbar
              ) : (
                <React.Fragment />
              )}
            </Col>
          </Row>
        </Container>
      </header>
    </div>
  );
};
