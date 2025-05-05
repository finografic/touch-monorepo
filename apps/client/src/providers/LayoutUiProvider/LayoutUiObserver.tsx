import type { FC } from 'react';
import { useEffect } from 'react';
import { useLayoutUi } from './LayoutUiContext';
import { PADS_UI_CONFIG } from 'src/config/app.config';
import { useRouteLoaderData } from 'react-router-dom';
import type { DataEntry } from 'types/data.types';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { routes } from 'routes/routes';
import type { PadsConfig, PadUI } from 'types/ui.types';
import { useOrders } from 'providers/OrdersProvider';

export const LayoutUiObserver: FC = () => {
  const { fieldKey } = useRouteConfig();
  const { orders } = useOrders();
  const loaderData = useRouteLoaderData(fieldKey || 'root') as DataEntry[];
  const { setUiPads, setUiNumPads, setUiFieldKey, initPadsFromLoaderData } = useLayoutUi();

  useEffect(
    function handleRouteChange() {
      if (!fieldKey) return;

      console.log('🚦 route changed:', { fieldKey });
      const padsConfig = PADS_UI_CONFIG[fieldKey] as PadsConfig;

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

  return null;
};
