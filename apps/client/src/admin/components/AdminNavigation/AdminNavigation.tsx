import React, { startTransition, useMemo } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { TabNav } from '@radix-ui/themes';
import { getAdminNavItems } from 'admin/config/admin.routes.selectors';
import { getNavItemText } from 'admin/utils/i18n-inlang.utils';
import { m } from 'i18n/messages';
import { getLocale, isLocale, setLocale } from 'i18n/runtime';

import { usePageTransition } from 'hooks/usePageTransition';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import { styles } from './AdminNavigation.styles';

export const AdminNavigation: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 100 });
  const { isAuthenticated, user } = useAuth();

  // ======================================================================== //

  startTransition(() => {
    // const lang = hydrateLang('language-tag', availableLanguageTags);
    // setLanguageTag(lang);

    const hostname = window.location.hostname;

    // console.log('Hydrate lang:', lang);
    // hydrateRoot(
    //   document,
    //   <StrictMode>
    //     <RemixBrowser />
    //   </StrictMode>,
    // );
  });

  // ======================================================================== //

  // Get navigation items from the single source of truth

  const navItems = useMemo(() => {
    const configNavItems = getAdminNavItems(isAuthenticated, user?.role);
    return [
      {
        id: 'dashboard',
        label: m.admin_dashboard_title({ role: user?.role }),
        path: '/admin',
      },
      ...configNavItems.map((item) => ({
        id: item.key,
        label: getNavItemText(user?.role, item.key),
        path: item.path,
      })),
    ];
  }, [t, isAuthenticated, location.pathname]);

  const handleNavigation = (path: string) => {
    if (location.pathname === path) return; // Don't navigate if already on the page

    // Use startTransition for non-urgent navigation updates
    startTransition(() => {
      navigateWithTransition(path);
    });
  };

  return (
    <div css={styles}>
      <Container className="container">
        <Row justify="center" align="center">
          <Col xs={12}>
            <TabNav.Root size="2" className="admin-nav">
              {navItems.map((item) => (
                <TabNav.Link key={item.id} asChild active={location.pathname === item.path}>
                  <button
                    type="button"
                    className={`nav-button ${location.pathname === item.path ? 'active' : ''} ${
                      isTransitioning ? 'transitioning' : ''
                    }`}
                    onClick={() => handleNavigation(item.path)}
                    disabled={isTransitioning}
                  >
                    {item.label}
                  </button>
                </TabNav.Link>
              ))}
            </TabNav.Root>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
