import React, { startTransition, useMemo, useState } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { TabNav } from '@radix-ui/themes';
import { gerAdminNavItemsByRole } from 'admin/config/admin.routes.selectors';

import { usePageTransition } from 'hooks/usePageTransition';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import { MoreButton } from './MoreButton';
import { DropdownNavButton } from './DropdownNavButton';
import { useResponsiveNav } from './useResponsiveNav';
import type { NavItem } from 'types/nav.types';

import { styles } from './AdminNavigation.styles';
import { getAdminNavItemText } from 'utils/i18n/i18n-inlang.helpers';
import { BREAKPOINTS } from 'styles/viewport/viewport.breakpoints';
import { NAVBAR_BREAKPOINT_CONFIG } from 'admin/components/AdminNavigation/navbar.config';
import { useMediaQuery } from 'usehooks-ts';

export interface AdminNavigationProps {
  displayIcons?: boolean;
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({ displayIcons = false }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 100 });
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Detect breakpoint for responsive config
  const isXxl = useMediaQuery(`(min-width: ${BREAKPOINTS.xxl}px)`);
  const isXl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
  const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
  const isSm = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px)`);

  // Get responsive config based on current breakpoint
  const getResponsiveConfig = () => {
    if (isXxl) return NAVBAR_BREAKPOINT_CONFIG.xxl!;
    if (isXl) return NAVBAR_BREAKPOINT_CONFIG.xl!;
    if (isLg) return NAVBAR_BREAKPOINT_CONFIG.lg!;
    if (isMd) return NAVBAR_BREAKPOINT_CONFIG.md!;
    if (isSm) return NAVBAR_BREAKPOINT_CONFIG.sm!;
    return NAVBAR_BREAKPOINT_CONFIG.xs!;
  };

  const responsiveConfig = getResponsiveConfig();

  const maxWidthValue = useMemo(() => {
    if (typeof responsiveConfig.maxWidth === 'string') {
      return responsiveConfig.maxWidth;
    }

    if (Object.values(BREAKPOINTS).includes(responsiveConfig.maxWidth)) {
      return responsiveConfig.maxWidth;
    }

    return undefined;
  }, [responsiveConfig]);

  const padding = responsiveConfig.padding;

  // Get navigation items from the single source of truth
  const navItems = useMemo((): NavItem[] => {
    return gerAdminNavItemsByRole(user?.role).map((item) => ({
      id: item.id,
      path: item.path,
      label: getAdminNavItemText({ key: item.id, role: user?.role }),
      icon: item.icon,
      children: item.children?.map((child) => ({
        ...child,
        label: getAdminNavItemText({ key: child.id, role: user?.role }),
      })),
    }));
  }, [t, isAuthenticated, user?.role, location.pathname]);

  const { containerRef, registerItem, visibleItems, overflowItems, hasOverflow } = useResponsiveNav({
    items: navItems,
    mobileBreakpoint: 'sm',
    isXxlBreakpoint: isXxl, // Pass xxl flag for temporary fix
  });

  // Track dropdown open states for grouped nav items
  const [dropdownStates, setDropdownStates] = React.useState<Record<string, boolean>>({});

  const handleNavigation = (path: string) => {
    if (location.pathname === path) return;
    setIsMenuOpen(false);
    // Close all dropdowns when navigating
    setDropdownStates({});

    startTransition(() => {
      navigateWithTransition(path);
    });
  };

  const handleDropdownToggle = (itemId: string, open: boolean) => {
    setDropdownStates((prev) => ({ ...prev, [itemId]: open }));
  };

  return (
    <div css={styles}>
      {/* <Container className="container"> */}
      <Row justify="center" align="center">
        <Col xs={12} style={{ overflow: 'visible' }}>
          {/* Wrapper div for measurement - TabNav might interfere */}
          <div
            ref={containerRef}
            style={{
              width: '100%',
              maxWidth: maxWidthValue
                ? `calc(${maxWidthValue}px - ${padding * 2}px)`
                : `calc(100% - ${padding * 2}px)`,
              padding: `0 ${padding}px`,
            }}
          >
            <TabNav.Root size="2" className="admin-nav" style={{ justifyContent: 'center' }}>
              {/* DESKTOP: Render all items for measurement, hide overflow with CSS */}
              {navItems.map((item) => {
                const isOverflow = overflowItems.some((o) => o.id === item.id);

                // Render dropdown for items with children
                if (item.children && item.children.length > 0) {
                  return (
                    <div
                      key={item.id}
                      ref={(el) => registerItem(item.id, el)}
                      style={{ display: isOverflow ? 'none' : undefined }}
                    >
                      <DropdownNavButton
                        item={item}
                        isOpen={dropdownStates[item.id] || false}
                        onOpenChange={(open) => handleDropdownToggle(item.id, open)}
                        onNavigate={handleNavigation}
                        activePath={location.pathname}
                        isTransitioning={isTransitioning}
                        displayIcons={displayIcons}
                      />
                    </div>
                  );
                }

                // Regular nav button
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
                      {displayIcons && item.icon && (
                        <item.icon width="16" height="16" style={{ marginRight: '0.5rem' }} />
                      )}
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
                  displayIcons={displayIcons}
                />
              )}
            </TabNav.Root>
          </div>
        </Col>
      </Row>
      {/* </Container> */}
    </div>
  );
};
