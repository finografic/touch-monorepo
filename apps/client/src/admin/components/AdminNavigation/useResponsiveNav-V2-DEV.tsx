import { useLayoutEffect, useRef, useState } from 'react';

export interface NavItem {
  id: string;
  label: string;
  path: string;
}

export const useResponsiveNav = (items: NavItem[] | undefined | null) => {
  const safeItems = Array.isArray(items) ? items : [];

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<string, HTMLElement>>(new Map());
  const [visibleItems, setVisibleItems] = useState<NavItem[]>(safeItems);
  const [overflowItems, setOverflowItems] = useState<NavItem[]>([]);

  const calculate = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!safeItems.length) return;

    const containerWidth = container.offsetWidth;
    const MORE_BUTTON_WIDTH = 100;

    let totalWidth = 0;
    const visible: NavItem[] = [];
    const overflow: NavItem[] = [];

    for (const item of safeItems) {
      const el = itemsRef.current.get(item.id);
      if (!el) continue;

      const w = el.offsetWidth;
      if (totalWidth + w <= containerWidth - MORE_BUTTON_WIDTH) {
        visible.push(item);
        totalWidth += w;
      } else {
        overflow.push(item);
      }
    }

    setVisibleItems(visible);
    setOverflowItems(overflow);
  };

  useLayoutEffect(() => {
    calculate();

    if (containerRef.current) {
      const observer = new ResizeObserver(() => calculate());
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [safeItems]);

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
