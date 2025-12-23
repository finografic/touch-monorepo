import React, { startTransition, useMemo, useState, useEffect, useRef } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { TabNav } from '@radix-ui/themes';
import { getAdminNavItemsByRole } from 'admin/config/admin.routes.selectors';

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
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 100 });
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Track the last known language to detect changes (including resource reloads)
  const lastLanguageRef = useRef(i18n.language);
  const [languageKey, setLanguageKey] = useState(0);

  // Listen to i18next language changes and resource reloads
  // This ensures the nav bar updates when translations are saved and resources are reloaded
  useEffect(() => {
    const handleLanguageChanged = () => {
      // Only update if language actually changed or resources were reloaded
      if (lastLanguageRef.current !== i18n.language) {
        lastLanguageRef.current = i18n.language;
        setLanguageKey((prev) => prev + 1);
      }
    };

    const handleResourcesLoaded = () => {
      // Resources were reloaded (e.g., after saving translations)
      // Force a re-render by updating the language key
      setLanguageKey((prev) => prev + 1);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    i18n.on('loaded', handleResourcesLoaded);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
      i18n.off('loaded', handleResourcesLoaded);
    };
  }, [i18n]);

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
  // languageKey is included to force re-render when translations are updated
  const navItems = useMemo((): NavItem[] => {
    return getAdminNavItemsByRole(user?.role).map((item) => ({
      id: item.id,
      path: item.path,
      // label: getAdminNavItemText({ key: item.id, role: user?.role }),
      label: t(`admin.pages.${item.id}.title`),
      icon: item.icon,
      children: item.children?.map((child) => {
        // Extract domain from child ID (e.g., "translationsUi" -> "ui", "translationsApp" -> "app")
        // or from path (e.g., "/admin/translations/ui" -> "ui")
        let domain: string | undefined;

        if (child.id.startsWith('translations')) {
          // Extract domain from ID: "translationsUi" -> "ui"
          domain = child.id.replace(/^translations/i, '').toLowerCase();
        } else if (child.path) {
          // Extract domain from path: "/admin/translations/ui" -> "ui"
          const pathMatch = child.path.match(/\/translations\/([^/]+)/);
          domain = pathMatch?.[1];
        }

        return {
          ...child,
          label: domain
            ? t(`admin.pages.translations.domains.${domain}.title`)
            : getAdminNavItemText({ key: child.id, role: user?.role }),
        };
      }),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, isAuthenticated, user?.role, location.pathname, languageKey]);

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
