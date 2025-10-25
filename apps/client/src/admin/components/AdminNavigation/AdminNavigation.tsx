import React, { startTransition, useMemo } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Col, Container, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { TabNav } from '@radix-ui/themes';
import { getAdminNavItems } from 'admin/config/admin.routes.selectors';
import { getNavLabel } from 'admin/utils/i18n.utils';
import { getLocale, isLocale, setLocale } from 'paraglide/runtime.js';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import { usePageTransition } from 'hooks/usePageTransition';

import { styles } from './AdminNavigation.styles';

export const AdminNavigation: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 100 });
  const { isAuthenticated, user } = useAuth();

  // ======================================================================== //

  // Example of filtering locales for a language switcher
  function getTenantSupportedLocales(hostname) {
    // Determine which tenant we're on based on hostname
    if (hostname.includes('customer1.com')) {
      // Customer1 only supports English and German
      return ['en', 'de'];
    } else if (hostname.includes('customer2.com')) {
      // Customer2 only supports French and Spanish
      return ['fr', 'es'];
    } else if (hostname.includes('customer3.com')) {
      // Customer3 supports all locales
      return ['en', 'de', 'fr', 'es'];
    }
  }

  startTransition(() => {
    // const lang = hydrateLang('language-tag', availableLanguageTags);
    // setLanguageTag(lang);

    const hostname = window.location.hostname;
    const supportedLocales = getTenantSupportedLocales(hostname);
    console.log('Supported locales:', supportedLocales);

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
    // return; // DASHBOARD first item (always visible)
    return [
      {
        id: 'dashboard',
        label: t('admin.pages.dashboard.title'),
        path: '/admin',
      },
      ...configNavItems.map((item) => ({
        id: item.key,
        label: getNavLabel(t, item.key),
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
