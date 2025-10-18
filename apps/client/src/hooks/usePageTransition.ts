import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface UsePageTransitionOptions {
  delay?: number;
  enableTransition?: boolean;
}

export const usePageTransition = ({
  delay = 100,
  enableTransition = true,
}: UsePageTransitionOptions = {}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle location changes
  useEffect(() => {
    if (!enableTransition) {
      setIsReady(true);
      return;
    }

    setIsTransitioning(true);
    setIsReady(false);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setIsReady(true);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname, delay, enableTransition]);

  // Safe navigation function with transition
  const navigateWithTransition = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      if (location.pathname === to) return; // Don't navigate if already there

      setIsTransitioning(true);
      setIsReady(false);

      // Small delay to prevent race conditions
      setTimeout(() => {
        if (options?.replace) {
          navigate(to, { replace: true });
        } else {
          navigate(to);
        }
      }, 50);
    },
    [location.pathname, navigate],
  );

  return {
    isTransitioning,
    isReady,
    navigateWithTransition,
    currentPath: location.pathname,
  };
};
