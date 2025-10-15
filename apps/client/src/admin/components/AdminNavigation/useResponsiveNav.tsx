import { useEffect, useRef, useState } from 'react';

export interface NavItem {
  id: string;
  label: string;
  path: string;
}

export interface UseResponsiveNavProps {
  items: NavItem[];
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl';
}

const BREAKPOINTS = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < BREAKPOINTS[mobileBreakpoint]);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  useEffect(() => {
    if (isMobile || !containerRef.current) {
      // On mobile, all items go into hamburger menu
      setVisibleItems([]);
      setOverflowItems(items);
      return;
    }

    const calculateVisibleItems = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const MORE_BUTTON_WIDTH = 100; // Approximate width of "More" button
      const PADDING = 40; // Safety padding

      let totalWidth = 0;
      const visible: NavItem[] = [];
      const overflow: NavItem[] = [];

      for (const item of items) {
        const element = itemsRef.current.get(item.id);
        if (!element) continue;

        const itemWidth = element.offsetWidth;
        const wouldOverflow = totalWidth + itemWidth + MORE_BUTTON_WIDTH + PADDING > containerWidth;

        if (wouldOverflow && visible.length > 0) {
          // Start putting items in overflow
          overflow.push(item);
        } else if (overflow.length === 0) {
          // Still fits
          visible.push(item);
          totalWidth += itemWidth;
        } else {
          // Already overflowing
          overflow.push(item);
        }
      }

      setVisibleItems(visible);
      setOverflowItems(overflow);
    };

    // Initial calculation
    calculateVisibleItems();

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(calculateVisibleItems);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', calculateVisibleItems);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateVisibleItems);
    };
  }, [items, isMobile]);

  const registerItem = (id: string, element: HTMLElement | null) => {
    if (element) {
      itemsRef.current.set(id, element);
    } else {
      itemsRef.current.delete(id);
    }
  };

  return {
    containerRef,
    registerItem,
    visibleItems,
    overflowItems,
    isMobile,
    hasOverflow: overflowItems.length > 0,
  };
};
