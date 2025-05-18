import { useEffect, useRef } from 'react';
import { useLayoutUi } from './LayoutUiContext';
import { useRouteLoaderData } from 'react-router-dom';
import type { DataEntry } from 'types/data.types';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import type { PadUI } from 'types/ui.types';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import type { OrderFilters } from 'types/orders.types';
import { useFilters } from 'hooks/useFilters';

export const LayoutUiObserver = () => {
  const { fieldKey, filterKey, padsConfig } = useRouteConfig();
  const { setIsNextDisabled } = usePagination();
  const { pads } = useLayoutUi();
  const isInitializedRef = useRef<Record<string, boolean>>({});

  const loaderData = useRouteLoaderData(fieldKey || 'root') as DataEntry[];
  const { setUiPads, setUiNumPads, setUiFieldKey, initPadsFromLoaderData } = useLayoutUi();
  const { filteredData, filters, serverFieldMap } = useFilters();

  useEffect(
    function handleRouteChange() {
      if (!fieldKey) {
        setUiPads([]);
        setUiNumPads(0);
        return;
      }

      if (loaderData && padsConfig) {
        isInitializedRef.current[fieldKey] = false;

        // ======================================================================== //
        // NOTE: HANDLE FILTERS - FILTER VISIBLE PADS, DEPENDANT ON ACTIVE FILTERS

        const visiblePadNames = [
          ...new Set(filteredData.map((entry) => entry?.[filterKey as keyof DataEntry]).filter(Boolean)),
        ];

        const filteredLoaderData = loaderData.filter((padData) => visiblePadNames.includes(padData.name));

        // log('__DEV - ** FILTERS **', 'cyan', serverFieldMap);

        // ======================================================================== //

        // Initialize pads with CHECKED state (from orders filters)
        initPadsFromLoaderData(
          filteredLoaderData,
          {
            ...padsConfig,
            initChecked: (pad: PadUI) => {
              // Check if this pad's value matches the active filter for its field
              return serverFieldMap[pad.name] === pad.value.name;
              // return serverFieldMap[pad.name] === pad.filterKey;
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
