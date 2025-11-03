import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useBoundingRect } from '@workspace/core/hooks';

interface SmartNavProps {
  items: string[];
}

export function SmartNav({ items }: SmartNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { rect: containerRect } = useBoundingRect(containerRef, 100);

  const [visibleCount, setVisibleCount] = useState(items.length);
  const [itemWidths, setItemWidths] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 🧮 Step 1: Measure each item once
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const widths = itemRefs.current.map((el) => el?.offsetWidth || 0);
    setItemWidths(widths);
  }, [items]);

  // 🧠 Step 2: On container resize, determine how many fit
  useEffect(() => {
    if (!containerRect || itemWidths.length === 0) return;

    const available = containerRect.width - 80; // 80px reserved for "More ▾"
    let total = 0;
    let count = itemWidths.length;

    for (let i = 0; i < itemWidths.length; i++) {
      total += itemWidths[i];
      if (total > available) {
        count = i;
        break;
      }
    }

    setVisibleCount(count);
  }, [containerRect, itemWidths]);

  const visibleItems = items.slice(0, visibleCount);
  const overflowItems = items.slice(visibleCount);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        whiteSpace: 'nowrap',
        alignItems: 'center',
        overflow: 'hidden',
        padding: '0 8px',
      }}
    >
      {items.map((item, i) => (
        <button
          key={item}
          ref={(el) => (itemRefs.current[i] = el)}
          style={{
            marginRight: 8,
            visibility: i < visibleCount ? 'visible' : 'hidden',
            position: i < visibleCount ? 'relative' : 'absolute',
          }}
        >
          {item}
        </button>
      ))}

      {overflowItems.length > 0 && (
        <div className="dropdown" style={{ position: 'relative' }}>
          <button>More ▾</button>
          <div
            className="dropdown-menu"
            style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              background: 'white',
              border: '1px solid #ccc',
              padding: '4px 0',
              minWidth: 160,
              zIndex: 50,
            }}
          >
            {overflowItems.map((item) => (
              <button
                key={item}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '6px 12px',
                  background: 'none',
                  border: 'none',
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
