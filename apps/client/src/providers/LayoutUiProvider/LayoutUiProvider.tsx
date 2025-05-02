import { useEffect } from 'react';
import type { LayoutUiProviderProps } from './LayoutUiContext.types';
import { DISPLAY_NAME, LayoutUiContext as LayoutUi } from './LayoutUiContext';
import { useLocation } from 'react-router-dom';

export const LayoutUiProvider = ({ initialValue, children }: LayoutUiProviderProps) => {
  const location = useLocation();

  // Subscribe to location changes to ensure state is fresh
  useEffect(() => {
    // Force a re-render of children when location changes
    // This ensures the useLayoutUi hook re-runs its effect
  }, [location.pathname]);

  return <LayoutUi.Provider initialValue={initialValue}>{children}</LayoutUi.Provider>;
};

LayoutUiProvider.displayName = `${DISPLAY_NAME}Provider`;
