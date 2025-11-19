import { useEffect, useLayoutEffect, useRef, useState } from 'react';

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
  const [visibleItems, setVisibleItems] = useState<NavItem[]>(items); // Show all initially
  const [overflowItems, setOverflowItems] = useState<NavItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const hasCalculatedRef = useRef(false);
  const pendingCalculationRef = useRef<number | null>(null);

  // Detect mobile breakpoint
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < BREAKPOINTS[mobileBreakpoint]);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  // Calculate visible items after render
  useEffect(() => {
    // Reset when items change
    itemsRef.current.clear();
    hasCalculatedRef.current = false;
    setIsCalculated(false);
    if (pendingCalculationRef.current) {
      cancelAnimationFrame(pendingCalculationRef.current);
      pendingCalculationRef.current = null;
    }

    if (isMobile || !containerRef.current) {
      // On mobile, all items go into hamburger menu
      setVisibleItems([]);
      setOverflowItems(items);
      setIsCalculated(true);
      return;
    }

    let resizeTimeout: NodeJS.Timeout;
    let resizeObserver: ResizeObserver | null = null;
    const isInitialLoadRef = { current: true };

    const calculateVisibleItems = () => {
      if (!containerRef.current) return;

      // Check if all items are registered (rendered)
      const allItemsRendered = items.length > 0 && items.every((item) => itemsRef.current.has(item.id));
      if (!allItemsRendered && isInitialLoadRef.current) {
        // Items not yet rendered, retry after a short delay (only on initial load)
        if (pendingCalculationRef.current) {
          cancelAnimationFrame(pendingCalculationRef.current);
        }
        pendingCalculationRef.current = requestAnimationFrame(calculateVisibleItems);
        return;
      }

      // Prevent multiple simultaneous calculations during initial load only
      if (hasCalculatedRef.current && isInitialLoadRef.current) {
        return;
      }

      // Mark as calculating
      hasCalculatedRef.current = true;
      if (pendingCalculationRef.current) {
        cancelAnimationFrame(pendingCalculationRef.current);
        pendingCalculationRef.current = null;
      }

      const containerWidth = containerRef.current.offsetWidth;
      const MORE_BUTTON_WIDTH = 120; // Width of "More" button with icon
      const PADDING = 40; // Safety padding

      let totalWidth = 0;
      const visible: NavItem[] = [];
      const overflow: NavItem[] = [];

      // Calculate which items fit
      // First, try to fit all items without "More" button
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const element = itemsRef.current.get(item.id);
        if (!element) {
          overflow.push(item);
          continue;
        }

        const itemWidth = element.offsetWidth;

        // Check if this item would fit WITHOUT "More" button
        const fitsWithoutMore = totalWidth + itemWidth + PADDING <= containerWidth;

        if (fitsWithoutMore) {
          // Item fits, add it to visible
          visible.push(item);
          totalWidth += itemWidth;
        } else {
          // This item doesn't fit, check if we can fit it WITH "More" button
          // (only if we already have visible items)
          if (visible.length > 0) {
            // Check if visible items + this item + "More" button fits
            const fitsWithMore = totalWidth + itemWidth + MORE_BUTTON_WIDTH + PADDING <= containerWidth;
            if (fitsWithMore) {
              // Fits with "More" button, add to visible
              visible.push(item);
              totalWidth += itemWidth;
            } else {
              // Doesn't fit even with "More", put this and remaining in overflow
              overflow.push(item);
              for (let j = i + 1; j < items.length; j++) {
                overflow.push(items[j]);
              }
              break;
            }
          } else {
            // No visible items yet, this must be the first item
            // If it doesn't fit, put everything in overflow
            overflow.push(item);
            for (let j = i + 1; j < items.length; j++) {
              overflow.push(items[j]);
            }
            break;
          }
        }
      }

      // Single state update to prevent staggered updates
      setVisibleItems(visible);
      setOverflowItems(overflow);
      setIsCalculated(true);

      // Set up ResizeObserver AFTER initial calculation is complete
      if (isInitialLoadRef.current && !resizeObserver && containerRef.current) {
        isInitialLoadRef.current = false;

        const handleResize = () => {
          if (resizeTimeout) {
            clearTimeout(resizeTimeout);
          }
          resizeTimeout = setTimeout(() => {
            hasCalculatedRef.current = false; // Allow recalculation on resize
            calculateVisibleItems();
          }, 150);
        };

        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(containerRef.current);
      }
    };

    // Wait for layout to be complete before calculating
    const timeoutId = setTimeout(() => {
      pendingCalculationRef.current = requestAnimationFrame(() => {
        pendingCalculationRef.current = requestAnimationFrame(() => {
          setTimeout(() => {
            calculateVisibleItems();
          }, 50);
        });
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (pendingCalculationRef.current) {
        cancelAnimationFrame(pendingCalculationRef.current);
        pendingCalculationRef.current = null;
      }
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      hasCalculatedRef.current = false;
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
    hasOverflow: isCalculated && overflowItems.length > 0,
  };
};
