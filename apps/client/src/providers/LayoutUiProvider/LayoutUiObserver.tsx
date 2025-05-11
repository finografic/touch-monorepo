import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { useLayoutUi } from './LayoutUiContext';
import { useRouteLoaderData } from 'react-router-dom';
import type { DataEntry } from 'types/data.types';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import type { PadUI } from 'types/ui.types';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';

export const LayoutUiObserver: FC = () => {
  const { fieldKey, padsConfig } = useRouteConfig();
  const { orders } = useOrders();
  const { setIsNextDisabled } = usePagination();
  const { pads } = useLayoutUi();
  const isInitializedRef = useRef<Record<string, boolean>>({});

  const loaderData = useRouteLoaderData(fieldKey || 'root') as DataEntry[];
  const { setUiPads, setUiNumPads, setUiFieldKey, initPadsFromLoaderData } = useLayoutUi();

  useEffect(
    function handleRouteChange() {
      if (!fieldKey) {
        setUiPads([]);
        setUiNumPads(0);
        return;
      }

      if (loaderData && padsConfig) {
        isInitializedRef.current[fieldKey] = false;

        // Get unique filter values for the current fieldKey across all orders
        const activeFilters = new Set( // TODO: REMOVE any
          orders.map((order) => (order.filters[fieldKey] as any)?.name).filter(Boolean),
        );

        console.log('%c __ACTIVE_FILTERS:', 'color:lime', { activeFilters });

        // Initialize pads with checked state from orders
        initPadsFromLoaderData(
          loaderData,
          {
            ...padsConfig,
            initChecked: (pad: PadUI) => activeFilters.has(pad.id),
          },
          fieldKey,
        );
        setUiFieldKey(fieldKey);

        isInitializedRef.current[fieldKey] = true;
        return;
      }

      // Only clear pads if we don't have valid data
      setUiPads([]);
      setUiNumPads(0);
    },
    [location.pathname, loaderData],
  );

  useEffect(
    function handlePadChange() {
      if (!pads?.length || !fieldKey) return;
      if (!isInitializedRef.current[fieldKey]) return;

      // NOTE: enable / disable navigation controls, base on padsConfig + current selection(s)
      if (padsConfig?.minRequired !== undefined) {
        const checkedCount = pads.filter((pad) => pad.isChecked).length;
        setIsNextDisabled(checkedCount < padsConfig.minRequired);
      }
    },
    [pads, fieldKey, padsConfig],
  );

  return null;
};
