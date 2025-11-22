import React, { startTransition, useMemo, useState } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { TabNav } from '@radix-ui/themes';
import { getAdminNavItems } from 'admin/config/admin.routes.selectors';
import { m } from 'i18n/messages';

import { usePageTransition } from 'hooks/usePageTransition';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import { getNavItemText } from 'utils/i18n/i18n-inlang.utils';
import { styles } from './TabPageMenu.styles';

export const TabPageMenu: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 100 });
  const { isAuthenticated, user } = useAuth();

  // Get navigation items from the single source of truth
  const navItems = useMemo(() => {
    const configNavItems = getAdminNavItems(user?.role);
    return [
      {
        id: 'dashboard',
        label: getNavItemText('admin', 'dashboard'),
        path: '/admin',
      },
      ...configNavItems.map((item) => ({
        id: item.key,
        label: getNavItemText(user?.role, item.key),
        path: item.path,
      })),
    ];
  }, [t, isAuthenticated, user?.role, location.pathname]);

  const handleNavigation = (path: string) => {
    if (location.pathname === path) return;

    startTransition(() => {
      navigateWithTransition(path);
    });
  };

  return (
    <div css={styles}>
      <Container className="container">
        <Row justify="center" align="center">
          <Col xs={12}>
            <div style={{ width: '100%' }}>
              <TabNav.Root size="2" className="admin-nav" style={{ justifyContent: 'center' }}>
                {/* DESKTOP: Render all items for measurement, hide overflow with CSS */}
                {navItems.map((item) => {
                  return (
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
                  );
                })}
              </TabNav.Root>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
