import React, { startTransition } from 'react';
import { TabNav } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { usePageTransition } from 'hooks/usePageTransition';
import { Col, Container, Row } from 'react-grid-system';
import { styles } from './AdminNavigation.styles';

export const AdminNavigation: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 100 });

  const navItems = [
    {
      id: 'dashboard',
      label: t('admin.pages.dashboard.title'),
      path: '/admin',
    },
    {
      id: 'translations',
      label: t('admin.pages.translations.title'),
      path: '/admin/translations',
    },
    {
      id: 'ui-labels',
      label: 'UI Labels / Translations',
      path: '/admin/ui-labels',
    },
    {
      id: 'languages',
      label: t('admin.pages.languages.title'),
      path: '/admin/languages',
    },
    {
      id: 'orders',
      label: t('admin.pages.orders.title'),
      path: '/admin/orders',
    },
    {
      id: 'sounds',
      label: 'Sounds',
      path: '/admin/sounds',
    },
  ];

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
                    className={`nav-button ${location.pathname === item.path ? 'active' : ''} ${isTransitioning ? 'transitioning' : ''}`}
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
