import { useEffect, useState } from 'react';

/**
 * Detects if the device has touch capability (e.g. touch screen).
 * Use for conditional styling — touch screens can have sticky :hover after tap.
 *
 * @returns true when 'ontouchstart' in window or navigator.maxTouchPoints > 0
 */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
}
