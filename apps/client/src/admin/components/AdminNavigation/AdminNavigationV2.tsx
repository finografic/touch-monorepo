import React, { startTransition, useMemo, useState } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { ChevronDownIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { DropdownMenu, TabNav } from '@radix-ui/themes';
import { getAdminNavItems } from 'admin/config/admin.routes.selectors';
import { getNavLabel } from 'admin/utils/i18n.utils';

import { useAuth } from 'providers/AuthProvider/AuthContext';

import { usePageTransition } from 'hooks/usePageTransition';

import { useResponsiveNav } from './useResponsiveNav';
import { styles } from './AdminNavigation.styles';

interface AdminNavigationV2Props {
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AdminNavigationV2: React.FC<AdminNavigationV2Props> = ({ mobileBreakpoint = 'md' }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 100 });
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get navigation items from the single source of truth
  const configNavItems = getAdminNavItems(isAuthenticated);

  // DASHBOARD first item (always visible)
  // useMemo to prevent infinite re-renders by stabilizing the array reference
  const navItems = useMemo(
    () => [
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
    ],
    [t, configNavItems],
  );

  const { containerRef, registerItem, visibleItems, overflowItems, isMobile, hasOverflow } = useResponsiveNav(
    {
      items: navItems,
      mobileBreakpoint,
    },
  );

  const handleNavigation = (path: string) => {
    if (location.pathname === path) return;
    setIsMenuOpen(false);

    startTransition(() => {
      navigateWithTransition(path);
    });
  };

  // Render a nav button
  const renderNavButton = (item: (typeof navItems)[0], ref?: (el: HTMLButtonElement | null) => void) => (
    <TabNav.Link key={item.id} asChild active={location.pathname === item.path}>
      <button
        ref={ref}
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

  return (
    <div css={styles}>
      <Container className="container">
        <Row justify="center" align="center">
          <Col xs={12}>
            <TabNav.Root size="2" className="admin-nav" ref={containerRef}>
              {/* MOBILE: Hamburger Menu */}
              {isMobile ? (
                <DropdownMenu.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <DropdownMenu.Trigger>
                    <button type="button" className="nav-button hamburger-button">
                      <HamburgerMenuIcon width="20" height="20" />
                      <span style={{ marginLeft: '0.5rem' }}>Menu</span>
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Content>
                    {navItems.map((item) => (
                      <DropdownMenu.Item
                        key={item.id}
                        onClick={() => handleNavigation(item.path)}
                        className={location.pathname === item.path ? 'active' : ''}
                      >
                        {item.label}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              ) : (
                <>
                  {/* DESKTOP: Visible Items */}
                  {visibleItems.map((item) => renderNavButton(item, (el) => registerItem(item.id, el)))}

                  {/* DESKTOP: More Dropdown for Overflow */}
                  {hasOverflow && (
                    <DropdownMenu.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                      <DropdownMenu.Trigger>
                        <button type="button" className="nav-button more-button">
                          More
                          <ChevronDownIcon
                            width="16"
                            height="16"
                            style={{ marginLeft: '0.25rem', transition: 'transform 0.2s' }}
                          />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Content>
                        {overflowItems.map((item) => (
                          <DropdownMenu.Item
                            key={item.id}
                            onClick={() => handleNavigation(item.path)}
                            className={location.pathname === item.path ? 'active' : ''}
                          >
                            {item.label}
                          </DropdownMenu.Item>
                        ))}
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  )}
                </>
              )}
            </TabNav.Root>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
