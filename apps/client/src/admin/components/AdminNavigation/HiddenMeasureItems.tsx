import { TabNav } from '@radix-ui/themes';
import type { NavItem } from 'types/nav.types';

interface HiddenMeasureItemsProps {
  navItems: NavItem[];
  itemsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

/**
 * Hidden measurement items for width calculation
 * Renders all items invisibly so their widths can be measured
 * Must match the structure of visible items for accurate measurement
 */
export function HiddenMeasureItems({ navItems, itemsRef }: HiddenMeasureItemsProps) {
  return (
    <div className="measure">
      {navItems.map((navItem, i) => (
        <TabNav.Link key={`measure-${navItem.id}`} asChild>
          <button
            ref={(el) => {
              // Register element for width measurement
              if (el && i < itemsRef.current.length) {
                itemsRef.current[i] = el;
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
}
