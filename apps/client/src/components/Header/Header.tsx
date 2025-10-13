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

  // Intelligent responsive column system [Claude v3.5]
  const getColumnProps = () => {
    if (titleAlign === 'center') {
      // Title centered: Left(empty) | Center(title) | Right(toolbar)
      return {
        left: { xs: 2, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 },
        center: { xs: 8, sm: 8, md: 6, lg: 6, xl: 6, xxl: 6 },
        right: { xs: 2, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 },
      };
    } else if (titleAlign === 'left') {
      // Title left: Left(title) | Center(empty) | Right(toolbar)
      return {
        left: { xs: 6, sm: 6, md: 4, lg: 4, xl: 4, xxl: 4 },
        center: { xs: 0, sm: 0, md: 4, lg: 4, xl: 4, xxl: 4 },
        right: { xs: 6, sm: 6, md: 4, lg: 4, xl: 4, xxl: 4 },
      };
    } else {
      // Title right (rare): Left(empty) | Center(empty) | Right(title + toolbar)
      return {
        left: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 },
        center: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 },
        right: { xs: 8, sm: 8, md: 8, lg: 8, xl: 8, xxl: 8 },
      };
    }
  };

  const { left: leftColProps, center: centerColProps, right: rightColProps } = getColumnProps();

  return (
    <div css={styles}>
      <header className={clsx('app-header', { 'admin-app-header': isAdmin })}>
        <Container className="container">
          <Row justify="between" align="center">
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

            {/* Center column - responsive width */}
            <Col {...centerColProps} className="col col-header-center">
              <Flex justify="center">{titleAlign === 'center' && <HeaderTitle />}</Flex>
            </Col>

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
