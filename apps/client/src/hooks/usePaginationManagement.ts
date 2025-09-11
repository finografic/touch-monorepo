import { useEffect } from 'react';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';

/**
 * Custom hook for managing pagination state based on pad selections
 * Consolidates pagination logic from LayoutUiObserver
 */
export const usePaginationManagement = () => {
  const { pads } = useLayoutUi();
  const { fieldKey, padsConfig } = useRouteConfig();
  const { setIsNextDisabled } = usePagination();

  // Handle pad changes for pagination
  useEffect(() => {
    if (!pads?.length || !fieldKey) return;

    if (padsConfig?.minRequired !== undefined) {
      const checkedCount = pads.filter((pad) => pad.isChecked).length;
      setIsNextDisabled(checkedCount < padsConfig.minRequired);
    }
  }, [pads, fieldKey, padsConfig?.minRequired, setIsNextDisabled]);
};
