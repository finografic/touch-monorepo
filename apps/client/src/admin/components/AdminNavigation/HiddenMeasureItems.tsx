import { TabNav } from '@radix-ui/themes';
import { useEffect, useRef, type FC } from 'react';
import type { NavItem } from 'types/nav.types';

interface HiddenMeasureItemsProps {
  navItems: NavItem[];
  navItemsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  calculateVisibleItemsCount: () => void;
}

/**
 * Hidden measurement items for width calculation
 * Renders all items invisibly so their widths can be measured
 * Must match the structure of visible items for accurate measurement
 */
export const HiddenMeasureItems: FC<HiddenMeasureItemsProps> = ({
  navItems,
  navItemsRef,
  calculateVisibleItemsCount,
}) => {
  const calculationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // NOTE: trigger calculation AFTER items are MEASURED (after render/update)
  useEffect(
    function initializeDelayedMeasurement() {
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }

      calculationTimeoutRef.current = setTimeout(() => {
        calculateVisibleItemsCount();
      }, 500);

      return () => {
        if (calculationTimeoutRef.current) {
          clearTimeout(calculationTimeoutRef.current);
        }
      };
    },
    [navItems, calculateVisibleItemsCount],
  );

  return (
    <div className="measure">
      {navItems.map((navItem, i) => (
        <TabNav.Link key={`measure-${navItem.id}`} asChild>
          <button
            ref={(el) => {
              if (el && i < navItemsRef.current.length) {
                navItemsRef.current[i] = el;
              }
            }}
            type="button"
            className="nav-button"
          >
            {navItem.label}
          </button>
        </TabNav.Link>
      ))}
    </div>
  );
};
