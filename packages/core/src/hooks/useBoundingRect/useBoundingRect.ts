import { useEffect, useRef, useState, useCallback } from 'react';

export function useBoundingRect<T extends HTMLElement>(
  passedRef?: React.RefObject<T>,
  throttleMs: number = 100,
) {
  const innerRef = useRef<T | null>(null);
  const ref = passedRef || innerRef;

  const [rect, setRect] = useState<DOMRect | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  const updateRect = useCallback(() => {
    if (!ref.current) return;
    setRect(ref.current.getBoundingClientRect());
  }, [ref]);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(() => {
      const now = performance.now();
      if (now - lastTimeRef.current < throttleMs) return;
      lastTimeRef.current = now;

      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(updateRect);
    });

    observer.observe(ref.current);
    updateRect();

    return () => {
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [ref, updateRect, throttleMs]);

  return { ref, rect };
}
