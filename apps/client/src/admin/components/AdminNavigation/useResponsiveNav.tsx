import { GAP, PADDING, MORE_BUTTON_WIDTH } from 'admin/components/AdminNavigation/navbar.config';
import { useLayoutEffect, useRef, useState } from 'react';
import type { NavItem } from 'types/nav.types';

export interface UseResponsiveNavProps {
  items: NavItem[];
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl';
  isXxlBreakpoint?: boolean; // Temporary fix: force one item to overflow at xxl
}

/**
 * Hook to manage responsive navigation with overflow menu
 *
 * Features:
 * - Calculates which items fit in available width
 * - Returns visible items and overflow items
 * - Detects mobile vs desktop based on breakpoint
 * - Recalculates on window resize
 *
 * Uses useLayoutEffect to ensure DOM is ready before calculation (prevents render loops)
 */

export const useResponsiveNav = ({
  items,
  mobileBreakpoint = 'md',
  isXxlBreakpoint = false,
}: UseResponsiveNavProps) => {
  // Create stable reference to items array
  const safeItems = Array.isArray(items) ? items : [];

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<string, HTMLElement>>(new Map());
  const [visibleItems, setVisibleItems] = useState<NavItem[]>(safeItems);
  const [overflowItems, setOverflowItems] = useState<NavItem[]>([]);

  // Calculate function captures safeItems and isXxlBreakpoint from closure
  const calculate = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!safeItems.length) return;

    const containerWidth = container.offsetWidth;

    let totalWidth = 0;
    const visible: NavItem[] = [];
    const overflow: NavItem[] = [];

    // First, try to fit all items without More button
    let allFit = true;
    for (let i = 0; i < safeItems.length; i++) {
      const item = safeItems[i];
      const el = itemsRef.current.get(item.id);
      if (!el) continue;

      const w = el.offsetWidth;
      const itemWidthWithGap = w + (visible.length > 0 ? GAP : 0);

      if (totalWidth + itemWidthWithGap + PADDING <= containerWidth) {
        visible.push(item);
        totalWidth += itemWidthWithGap;
      } else {
        allFit = false;
        // Put this item and all remaining items in overflow
        for (let j = i; j < safeItems.length; j++) {
          overflow.push(safeItems[j]);
        }
        break;
      }
    }

    // If all items fit, we're done
    if (allFit) {
      setVisibleItems(visible);
      setOverflowItems([]);
      return;
    }

    // Otherwise, recalculate with More button space reserved
    totalWidth = 0;
    visible.length = 0;
    overflow.length = 0;

    for (let i = 0; i < safeItems.length; i++) {
      const item = safeItems[i];
      const el = itemsRef.current.get(item.id);
      if (!el) continue;

      const w = el.offsetWidth;
      const itemWidthWithGap = w + (visible.length > 0 ? GAP : 0);
      const availableWidth = containerWidth - MORE_BUTTON_WIDTH - PADDING;

      if (totalWidth + itemWidthWithGap <= availableWidth) {
        visible.push(item);
        totalWidth += itemWidthWithGap;
      } else {
        // Put this item and all remaining items in overflow
        for (let j = i; j < safeItems.length; j++) {
          overflow.push(safeItems[j]);
        }
        break;
      }
    }

    // Temporary fix: At xxl breakpoint, force one item to overflow
    if (isXxlBreakpoint && visible.length > 0 && overflow.length === 0) {
      const lastVisible = visible.pop();
      if (lastVisible) {
        overflow.push(lastVisible);
      }
    }

    setVisibleItems(visible);
    setOverflowItems(overflow);
  };

  // useLayoutEffect runs synchronously after DOM mutations, before paint
  // This ensures DOM is ready and prevents render loops
  useLayoutEffect(() => {
    calculate();

    if (containerRef.current) {
      const observer = new ResizeObserver(() => calculate());
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [safeItems, isXxlBreakpoint]); // Depend on safeItems and xxl flag

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
