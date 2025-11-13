import React, { startTransition, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useBoundingRect } from '@workspace/core/hooks';

import { TabNav } from '@radix-ui/themes';
import { getAdminNavItems } from 'admin/config/admin.routes.selectors';
import { m } from 'i18n/messages';
import { getLocale, isLocale, setLocale } from 'i18n/runtime';

import { usePageTransition } from 'hooks/usePageTransition';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import { getNavItemText } from 'utils/i18n/i18n-inlang.utils';
import { styles } from './AdminNavigation.styles';

export const AdminNavigation: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 100 });
  const { isAuthenticated, user } = useAuth();

  // ======================================================================== //

  startTransition(() => {
    const hostname = window.location.hostname;
  });

  const handleNavigation = (path: string) => {
    if (location.pathname === path) return; // Don't navigate if already on the page

    // Use startTransition for non-urgent navigation updates
    startTransition(() => {
      navigateWithTransition(path);
    });
  };

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
  }, [t, isAuthenticated, location.pathname, user?.role]);

  // ======================================================================== //

  const containerRef = useRef<HTMLDivElement>(null);
  const { rect: containerRect } = useBoundingRect(containerRef, 100);

  const [visibleCount, setVisibleCount] = useState(navItems.length);
  const [itemWidths, setItemWidths] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 🧮 Step 1: Measure each item once
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const widths = itemRefs.current.map((el) => el?.offsetWidth || 0);
    setItemWidths(widths);
  }, [navItems]);

  // 🧠 Step 2: On container resize, determine how many fit
  useEffect(() => {
    if (!containerRect || itemWidths.length === 0) return;

    const available = containerRect.width - 80; // 80px reserved for "More ▾"
    let total = 0;
    let count = itemWidths.length;

    for (let i = 0; i < itemWidths.length; i++) {
      total += itemWidths[i];
      if (total > available) {
        count = i;
        break;
      }
    }

    setVisibleCount(count);
  }, [containerRect, itemWidths]);

  const visibleItems = navItems.slice(0, visibleCount);
  const overflowItems = navItems.slice(visibleCount);

  // ======================================================================== //

  return (
    <div css={styles} ref={containerRef}>
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
              {/* ====================================================================== */}
              {overflowItems.length > 0 && (
                <div className="dropdown" style={{ position: 'relative' }}>
                  <button>More ▾</button>
                  <div
                    className="dropdown-menu"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      background: 'white',
                      border: '1px solid #ccc',
                      padding: '4px 0',
                      minWidth: 160,
                      zIndex: 50,
                    }}
                  >
                    {overflowItems.map((item) => (
                      <button
                        key={item.id}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '6px 12px',
                          background: 'none',
                          border: 'none',
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </TabNav.Root>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
