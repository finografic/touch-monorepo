import { type FC, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { usePageTransition } from 'hooks/usePageTransition';

import type { NavItem } from 'types/nav.types';
import { HiddenMeasureItems } from './HiddenMeasureItems';
import { MoreMenu } from './MoreMenu';

interface AdminNavbarProps {
  navItems: NavItem[];
}

export const AdminNavbar: FC<AdminNavbarProps> = ({ navItems }) => {
  const location = useLocation();
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 100 });
  const containerRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const moreButtonRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(navItems.length);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const calculateVisibleItemsCount = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;

    // Get MORE button width from the ref (MoreButton component)
    const moreButtonElement = moreButtonRef.current?.querySelector('button');
    const moreWidth = moreButtonElement?.offsetWidth ?? 120; // Fallback to 120px

    let totalWidthUsed = 0;
    let fitCount = navItems.length;

    for (let i = 0; i < navItems.length; i++) {
      const navItemElement = navItemsRef.current[i];
      if (!navItemElement) continue;

      totalWidthUsed += navItemElement.offsetWidth;

      if (totalWidthUsed + moreWidth > containerWidth) {
        fitCount = i;
        break;
      }
    }

    setVisibleCount(fitCount);
  }, [navItems]);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver(() => calculateVisibleItemsCount());
      observer.observe(containerRef.current);

      return () => observer.disconnect();
    }
  }, [navItems]);

  const visibleNavItems = navItems.slice(0, visibleCount);
  const overflowNavItems = navItems.slice(visibleCount);

  const handleNavigate = (path: string) => {
    if (location.pathname === path) return;
    setIsMoreMenuOpen(false);
    navigateWithTransition(path);
  };

  return (
    <nav className="navbar" ref={containerRef}>
      <div className="nav-items">
        <div className="admin-nav" style={{ justifyContent: 'center' }}>
          {visibleNavItems.map((navItem, i) => {
            const isActive = location.pathname === navItem.path;

            return (
              <button
                ref={(el) => (navItemsRef.current[i] = el)}
                type="button"
                key={`nav-item-${navItem.id}-${i}`}
                aria-current={isActive ? 'page' : undefined}
                className={`nav-button ${isActive ? 'active' : ''} ${
                  isTransitioning ? 'transitioning' : ''
                }`}
                onClick={() => handleNavigate(navItem.path)}
                disabled={isTransitioning}
              >
                {navItem.label}
              </button>
            );
          })}

          {/* HIDDEN measurement items - for width calculation */}
          <HiddenMeasureItems
            navItems={navItems}
            navItemsRef={navItemsRef}
            calculateVisibleItemsCount={calculateVisibleItemsCount}
          />

          {/* MORE button - using our MoreButton component */}
          {overflowNavItems.length > 0 && (
            <div ref={moreButtonRef} className="more-wrapper">
              <MoreMenu
                items={overflowNavItems}
                isOpen={isMoreMenuOpen}
                onOpenChange={setIsMoreMenuOpen}
                onNavigate={handleNavigate}
                activePath={location.pathname}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
