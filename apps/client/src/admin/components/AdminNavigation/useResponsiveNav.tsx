import { useEffect, useRef, useState } from 'react';
import type { NavItem } from 'types/nav.types';

export interface UseResponsiveNavProps {
  items: NavItem[];
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Hook to manage responsive navigation with overflow menu
 *
 * Features:
 * - Calculates which items fit in available width
 * - Returns visible items and overflow items
 * - Detects mobile vs desktop based on breakpoint
 * - Recalculates on window resize
 */

export const useResponsiveNav = ({ items, mobileBreakpoint = 'md' }: UseResponsiveNavProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<string, HTMLElement>>(new Map());
  const [visibleItems, setVisibleItems] = useState<NavItem[]>(items);
  const [overflowItems, setOverflowItems] = useState<NavItem[]>([]);

  const calculateVisibleItems = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const MORE_BUTTON_WIDTH = 120; // your estimate
    const PADDING = 40;
    // const PADDING = 120;

    let totalWidth = 0;
    const visible: NavItem[] = [];
    const overflow: NavItem[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const element = itemsRef.current.get(item.id);
      if (!element) continue;

      const itemWidth = element.offsetWidth;
      const fitsWithoutMore = totalWidth + itemWidth + PADDING <= containerWidth;

      if (fitsWithoutMore) {
        visible.push(item);
        totalWidth += itemWidth;
        continue;
      }

      // otherwise it doesn't fit
      overflow.push(item);
    }

    setVisibleItems(visible);
    setOverflowItems(overflow);
  };

  useEffect(() => {
    // Run measurement when items change
    calculateVisibleItems();

    // Observe container resizes
    let observer: ResizeObserver | null = null;
    if (containerRef.current) {
      observer = new ResizeObserver(() => {
        calculateVisibleItems();
      });
      observer.observe(containerRef.current);
    }

    return () => {
      observer?.disconnect();
    };
  }, [items]); // remeasure when nav items change (e.g. i18n load)

  const registerItem = (id: string, el: HTMLElement | null) => {
    if (el) itemsRef.current.set(id, el);
    else itemsRef.current.delete(id);
  };

  return {
    containerRef,
    registerItem,
    visibleItems,
    overflowItems,
    hasOverflow: overflowItems.length > 0,
  };
};
