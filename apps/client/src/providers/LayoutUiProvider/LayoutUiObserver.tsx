import { useEffect, useRef } from 'react';
import { useLayoutUi } from './LayoutUiContext';
import { useRouteLoaderData } from 'react-router-dom';
import type { DataEntry } from 'types/data.types';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import type { PadUI } from 'types/ui.types';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import type { OrderFilters } from 'types/filters.types';
import { useFilters } from 'hooks/useFilters';
import { OrderFieldKeys } from 'constants/app.config';

export const LayoutUiObserver = () => {
  const { fieldKey, filterKey, padsConfig } = useRouteConfig();
  const { setIsNextDisabled } = usePagination();
  const { pads } = useLayoutUi();
  const isInitializedRef = useRef<Record<string, boolean>>({});

  const loaderData = useRouteLoaderData(fieldKey || 'root') as DataEntry[];
  const { setUiPads, setUiNumPads, setUiFieldKey, initPadsFromLoaderData } = useLayoutUi();
  const { dataPool, filters, serverFieldMap } = useFilters();

  useEffect(
    function handleRouteChange() {
      if (!fieldKey) {
        setUiPads([]);
        setUiNumPads(0);
        return;
      }

      if (loaderData && padsConfig) {
        isInitializedRef.current[fieldKey] = false;

        // Always use dataPool which only includes filters up to (but not including) current step
        const visiblePadNames = [
          ...new Set(dataPool.map((entry) => entry?.[filterKey as keyof DataEntry]).filter(Boolean)),
        ];

        const filteredLoaderData = loaderData.filter((padData) => visiblePadNames.includes(padData.name));

        initPadsFromLoaderData(
          filteredLoaderData,
          {
            ...padsConfig,
            initChecked: (pad: PadUI) => serverFieldMap[pad.name] === pad.value.name,
          },
          fieldKey,
        );

        setUiFieldKey(fieldKey);
        isInitializedRef.current[fieldKey] = true;
        return;
      }

      setUiPads([]);
      setUiNumPads(0);
    },
    [location.pathname, loaderData, dataPool, filters],
  );

  useEffect(
    function handlePadChange() {
      if (!pads?.length || !fieldKey) return;
      if (!isInitializedRef.current[fieldKey]) return;

      if (padsConfig?.minRequired !== undefined) {
        const checkedCount = pads.filter((pad) => pad.isChecked).length;
        setIsNextDisabled(checkedCount < padsConfig.minRequired);
      }
    },
    [pads, fieldKey, padsConfig],
  );

  return null;
};
