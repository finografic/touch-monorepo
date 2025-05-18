import { useEffect, useRef } from 'react';
import { useLayoutUi } from './LayoutUiContext';
import { useRouteLoaderData } from 'react-router-dom';
import type { DataEntry } from 'types/data.types';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import type { PadUI } from 'types/ui.types';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import type { OrderFilters } from 'types/orders.types';
import { useFilters } from 'hooks/useFilters';
// import { useFilters } from 'hooks/useFilters';

export const LayoutUiObserver = () => {
  const { fieldKey, filterKey, padsConfig } = useRouteConfig();
  const { orders } = useOrders();
  const { setIsNextDisabled } = usePagination();
  const { pads } = useLayoutUi();
  const isInitializedRef = useRef<Record<string, boolean>>({});

  const loaderData = useRouteLoaderData(fieldKey || 'root') as DataEntry[];
  const { setUiPads, setUiNumPads, setUiFieldKey, initPadsFromLoaderData } = useLayoutUi();
  const { dataFiltered, filters } = useFilters();

  useEffect(
    function handleRouteChange() {
      if (!fieldKey) {
        setUiPads([]);
        setUiNumPads(0);
        return;
      }

      if (loaderData && padsConfig) {
        isInitializedRef.current[fieldKey] = false;

        log('__DEV - loaderData FULL', 'lime', loaderData);

        /*
        // Get unique filter values for the current fieldKey across all orders
        const activeFilters = [
          ...new Set(orders.map((order) => (order.filters[fieldKey] as any)?.name).filter(Boolean)), // TODO: REMOVE any
        ];
        */

        // ======================================================================== //

        // Get unique filter values by combining all orders' filters into a single object
        const activeFilters = orders.reduce(
          (acc, order) => {
            Object.entries(order.filters as OrderFilters).forEach(([filterKey, filterValue]) => {
              if (filterValue?.name) {
                acc[filterKey] = filterValue.name;
              }
            });
            return acc;
          },
          {} as Record<string, string>,
        );

        // log('__DEV - loaderData x FILTERS', 'cyan', activeFilters);

        // ======================================================================== //

        const activeFiltersV2 = orders.reduce(
          (acc, order) => {
            Object.values(order.filters as OrderFilters).forEach((filterValue) => {
              if (filterValue?.lookup) {
                const [key, value] = Object.entries(filterValue.lookup)[0];
                acc[key as string] = value as string;
              }
            });
            return acc;
          },
          {} as Record<string, string>,
        );

        log('__DEV - loaderData x FILTERS_V2', 'cyan', activeFiltersV2);

        // log('__DEV - FILTERED DATA', 'hotpink', dataFiltered);

        // log('__DEV - XXX', 'blue', filterKey, filters);
        // log('__DEV - XXX', 'blue', filterKey, filters, loaderData);

        // Get unique filter values for the current fieldKey across all orders
        // const filterValues = [
        //   ...new Set(loaderData.map((padData) => (padData[filterKey] as any)?.name).filter(Boolean)), // TODO: REMOVE any
        // ];

        const filteredEntries = [
          ...new Set(dataFiltered.map((orderEntry) => orderEntry?.[filterKey]).filter(Boolean)),
        ];

        log('__DEV - Z-1', 'blue', dataFiltered, filteredEntries);

        log('__DEV - Z-2', 'grey', { filterKey }, dataFiltered.length, filteredEntries.length);

        const filteredLoaderData = loaderData.filter((padData) => filteredEntries.includes(padData.name));

        // log('__DEV - loaderData RESULTS', 'blue', filterKey, filteredEntries, dataFiltered);
        // log('__DEV - XXX', 'blue', { loaderData: loaderData.length }, loaderData, filteredEntries);
        // log('__DEV - XXX', 'blue', filteredLoaderData);

        // const filtered

        // loaderData.map((padData) => {
        //   const TEST = (padData[filterKey] as any)?.name;
        //   log('__DEV - XXX', 'blue', padData, filterKey, TEST);
        //   return TEST;
        // });

        // ======================================================================== //

        // Initialize pads with CHECKED state (from orders filters)
        initPadsFromLoaderData(
          filteredLoaderData,
          {
            ...padsConfig,
            initChecked: (pad: PadUI) => {
              // Check if this pad's value matches the active filter for its field
              return activeFilters[pad.name] === pad.value.name;
            },
          },
          fieldKey,
        );

        setUiFieldKey(fieldKey);
        isInitializedRef.current[fieldKey] = true;
        return;
      }

      // NOTE: Only clear pads if we don't have valid data
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
