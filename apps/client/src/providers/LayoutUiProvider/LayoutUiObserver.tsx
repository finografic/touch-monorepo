/* eslint-disable prefer-arrow-callback */
import type { FC } from 'react';
import { useEffect } from 'react';
import { useLayoutUi } from './LayoutUiContext';
import { PADS_UI_CONFIG } from 'src/config/app.config';
import { useRouteLoaderData } from 'react-router-dom';
import type { DataEntry } from 'types/data.types';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { routes } from 'routes/routes';
import type { PadsConfig } from 'types/ui.types';

export const LayoutUiObserver: FC = () => {
  const { fieldKey } = useRouteConfig();
  const loaderData = useRouteLoaderData(fieldKey || 'root') as DataEntry[];
  const { setUiPads, setUiNumPads, setUiFieldKey, initPadsFromLoaderData } = useLayoutUi();

  useEffect(
    function handleRouteChange() {
      if (!fieldKey) return;

      console.log('🔍  Route Change Effect:', { fieldKey });
      const padsConfig = PADS_UI_CONFIG[fieldKey] as PadsConfig;

      if (loaderData && padsConfig) {
        initPadsFromLoaderData(loaderData, padsConfig);
        setUiFieldKey(fieldKey);
        // setUiPads([]);
        // setUiNumPads(0);
        return;
      }

      setUiPads([]);
      setUiNumPads(0);
    },
    [fieldKey, routes, location.pathname, loaderData],
  );

  return null;
};
