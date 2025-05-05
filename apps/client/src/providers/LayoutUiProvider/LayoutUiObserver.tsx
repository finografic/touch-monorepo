import type { FC } from 'react';
import { useEffect } from 'react';
import { useLayoutUi } from './LayoutUiContext';
import { useRouteLoaderData } from 'react-router-dom';
import type { DataEntry } from 'types/data.types';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { routes } from 'routes/routes';
import type { PadUI } from 'types/ui.types';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';

export const LayoutUiObserver: FC = () => {
  // const isMounted = useIsMounted();
  const { fieldKey, padsConfig } = useRouteConfig();
  const { orders } = useOrders();
  const { isNextDisabled, setIsNextDisabled } = usePagination();
  const { pads } = useLayoutUi();

  const loaderData = useRouteLoaderData(fieldKey || 'root') as DataEntry[];
  const { setUiPads, setUiNumPads, setUiFieldKey, initPadsFromLoaderData } = useLayoutUi();

  useEffect(
    function handleRouteChange() {
      if (!fieldKey) return;

      if (loaderData && padsConfig) {
        // Get unique filter values for the current fieldKey across all orders
        const activeFilters = new Set(orders.map((order) => order.filters[fieldKey]).filter(Boolean));

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
        return;
      }

      setUiPads([]);
      setUiNumPads(0);
    },
    [fieldKey, routes, location.pathname, loaderData, orders],
  );

  useEffect(
    function handlePadChange() {
      if (!pads || !pads.length) return;

      if (padsConfig?.minRequired) {
        // TODO: implement minRequired check using setIsNextDisabled
        console.log('🚦 pads changed:', { pads });
      }
    },
    [pads],
  );

  return null;
};
