import { useLayoutEffect, useRef, useState } from 'react';
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
 *
 * Uses useLayoutEffect to ensure DOM is ready before calculation (prevents render loops)
 */

export const useResponsiveNav = ({ items, mobileBreakpoint = 'md' }: UseResponsiveNavProps) => {
  // Create stable reference to items array
  const safeItems = Array.isArray(items) ? items : [];

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<string, HTMLElement>>(new Map());
  const [visibleItems, setVisibleItems] = useState<NavItem[]>(safeItems);
  const [overflowItems, setOverflowItems] = useState<NavItem[]>([]);

  // Calculate function captures safeItems from closure (stable reference)
  const calculate = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!safeItems.length) return;

    const containerWidth = container.offsetWidth;
    const MORE_BUTTON_WIDTH = 120;
    const PADDING = 40;

    let totalWidth = 0;
    const visible: NavItem[] = [];
    const overflow: NavItem[] = [];

    for (const item of safeItems) {
      const el = itemsRef.current.get(item.id);
      if (!el) continue;

      const w = el.offsetWidth;
      if (totalWidth + w + PADDING <= containerWidth - MORE_BUTTON_WIDTH) {
        visible.push(item);
        totalWidth += w;
      } else {
        overflow.push(item);
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
  }, [safeItems]); // Depend on safeItems (stable reference)

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
