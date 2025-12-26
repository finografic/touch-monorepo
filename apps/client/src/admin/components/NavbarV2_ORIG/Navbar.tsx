import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface NavbarProps {
  items: string[];
}

export default function Navbar({ items }: NavbarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const moreRef = useRef<HTMLButtonElement>(null);

  const [visibleCount, setVisibleCount] = useState(items.length);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const calculate = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const moreWidth = moreRef.current?.offsetWidth ?? 0;

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
    };

    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, [items]);

  const visibleItems = items.slice(0, visibleCount);
  const overflowItems = items.slice(visibleCount);

  return (
    <nav className="navbar" ref={containerRef}>
      <div className="nav-items">
        {visibleItems.map((item, i) => (
          <button key={item} ref={(el) => (itemsRef.current[i] = el)} className="nav-item">
            {item}
          </button>
        ))}

        {/* Hidden measurement items */}
        <div className="measure">
          {items.map((item, i) => (
            <button key={item} ref={(el) => (itemsRef.current[i] = el)} className="nav-item">
              {item}
            </button>
          ))}
        </div>

        {overflowItems.length > 0 && (
          <div className="more-wrapper">
            <button ref={moreRef} className="nav-item more" onClick={() => setOpen((o) => !o)}>
              More ▾
            </button>

            {open && (
              <div className="popover">
                {overflowItems.map((item) => (
                  <button key={item} className="popover-item">
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
