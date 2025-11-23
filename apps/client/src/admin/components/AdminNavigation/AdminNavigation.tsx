import React, { startTransition, useMemo, useState } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { DropdownMenu, TabNav } from '@radix-ui/themes';
import { getAdminNavItems } from 'admin/config/admin.routes.selectors';

import { usePageTransition } from 'hooks/usePageTransition';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import { getNavItemText } from 'utils/i18n/i18n-inlang.utils';
import { MoreButton } from './MoreButton';
import { useResponsiveNav } from './useResponsiveNav';
import { styles } from './AdminNavigation.styles';

export const AdminNavigation: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 100 });
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get navigation items from the single source of truth
  const navItems = useMemo(() => {
    const configNavItems = getAdminNavItems(user?.role);
    return [
      ...configNavItems.map((item) => ({
        id: item.key,
        label: getNavItemText(user?.role, item.key),
        // label: getMessageTexts(['admin', item.key], ['card', 'title'], user?.role)?.title, // V3
        path: item.path,
      })),
    ];
  }, [t, isAuthenticated, user?.role, location.pathname]);

  const { containerRef, registerItem, visibleItems, overflowItems, isMobile, hasOverflow } = useResponsiveNav(
    {
      items: navItems,
      mobileBreakpoint: 'md',
    },
  );

  const handleNavigation = (path: string) => {
    if (location.pathname === path) return;
    setIsMenuOpen(false);

    startTransition(() => {
      navigateWithTransition(path);
    });
  };

  return (
    <div css={styles}>
      <Container className="container">
        <Row justify="center" align="center">
          <Col xs={12}>
            {/* Wrapper div for measurement - TabNav might interfere */}
            <div ref={containerRef} style={{ width: '100%' }}>
              <TabNav.Root size="2" className="admin-nav" style={{ justifyContent: 'center' }}>
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
                    {/* DESKTOP: Render all items for measurement, hide overflow with CSS */}
                    {navItems.map((item) => {
                      const isOverflow = overflowItems.some((o) => o.id === item.id);
                      return (
                        <TabNav.Link
                          key={item.id}
                          asChild
                          active={location.pathname === item.path}
                          style={{ display: isOverflow ? 'none' : undefined }}
                        >
                          <button
                            ref={(el) => registerItem(item.id, el)}
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
                    {/* DESKTOP: More Dropdown for Overflow */}
                    {hasOverflow && (
                      <MoreButton
                        items={overflowItems}
                        isOpen={isMenuOpen}
                        onOpenChange={setIsMenuOpen}
                        onNavigate={handleNavigation}
                        activePath={location.pathname}
                      />
                    )}
                  </>
                )}
              </TabNav.Root>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
