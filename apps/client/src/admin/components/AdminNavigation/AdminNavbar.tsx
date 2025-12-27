import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type FC } from 'react';
import { useLocation } from 'react-router-dom';
import { TabNav } from '@radix-ui/themes';

import { usePageTransition } from 'hooks/usePageTransition';
import { MoreButton } from './MoreButton';
import { HiddenMeasureItems } from './HiddenMeasureItems';
import type { NavItem } from 'types/nav.types';

interface AdminNavbarProps {
  navItems: NavItem[];
}

export const AdminNavbar: FC<AdminNavbarProps> = ({ navItems }) => {
  const location = useLocation();
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 100 });
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const moreButtonRef = useRef<HTMLDivElement>(null);
  const calculationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract labels from navItems for width calculation
  const items = useMemo(() => navItems.map((item) => item.label), [navItems]);

  const [visibleCount, setVisibleCount] = useState(items.length);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const calculate = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    // Get MORE button width from the ref (MoreButton component)
    const moreButtonEl = moreButtonRef.current?.querySelector('button');
    const moreWidth = moreButtonEl?.offsetWidth ?? 120; // Fallback to 120px

    let used = 0;
    let fitCount = items.length;

    for (let i = 0; i < items.length; i++) {
      const el = itemsRef.current[i];
      if (!el) continue;

      used += el.offsetWidth;

      if (used + moreWidth > containerWidth) {
        fitCount = i;
        break;
      }
    }

    setVisibleCount(fitCount);
  }, [items]);

  useLayoutEffect(() => {
    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, [items]);

  // NOTE: trigger calculation AFTER items are MEASURED (after render/update)
  useEffect(() => {
    if (calculationTimeoutRef.current) {
      clearTimeout(calculationTimeoutRef.current);
    }

    calculationTimeoutRef.current = setTimeout(() => {
      calculate();
    }, 500);

    return () => {
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }
    };
  }, [items, calculate]);

  const visibleNavItems = navItems.slice(0, visibleCount);
  const overflowNavItems = navItems.slice(visibleCount);

  const handleNavigate = (path: string) => {
    if (location.pathname === path) return;
    setIsMoreOpen(false);
    navigateWithTransition(path);
  };

  return (
    <nav className="navbar" ref={containerRef}>
      <div className="nav-items">
        <TabNav.Root size="2" className="admin-nav" style={{ justifyContent: 'center' }}>
          {visibleNavItems.map((navItem, i) => {
            const isActive = location.pathname === navItem.path;

            return (
              <TabNav.Link key={navItem.id} asChild active={isActive}>
                <button
                  ref={(el) => (itemsRef.current[i] = el)}
                  type="button"
                  className={`nav-button ${isActive ? 'active' : ''} ${
                    isTransitioning ? 'transitioning' : ''
                  }`}
                  onClick={() => handleNavigate(navItem.path)}
                  disabled={isTransitioning}
                >
                  {navItem.label}
                </button>
              </TabNav.Link>
            );
          })}

          {/* HIDDEN measurement items - for width calculation */}
          <HiddenMeasureItems navItems={navItems} itemsRef={itemsRef} />

          {/* More button - using our MoreButton component */}
          {overflowNavItems.length > 0 && (
            <div ref={moreButtonRef} className="more-wrapper">
              <MoreButton
                items={overflowNavItems}
                isOpen={isMoreOpen}
                onOpenChange={setIsMoreOpen}
                onNavigate={handleNavigate}
                activePath={location.pathname}
              />
            </div>
          )}
        </TabNav.Root>
      </div>
    </nav>
  );
};
