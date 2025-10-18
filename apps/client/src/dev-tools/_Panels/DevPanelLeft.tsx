import { useLocation } from 'react-router-dom';

import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';

import { useRouteConfig } from 'routes/hooks/useRouteConfig';

import { DevFilterResults } from 'dev-tools/data/DevFilterResults/DevFilterResults';
import { DevOrderProfile } from 'dev-tools/data/DevOrderProfile/DevOrderProfile';
import { SessionAndTimers } from 'dev-tools/data/SessionAndTimers/SessionAndTimers';
import { stylesLeft } from './DevPanels.styles';

export const DevPanelLeft = () => {
  const location = useLocation();
  const { filterKey, padsConfig } = useRouteConfig();
  const { pads: padsSource } = useLayoutUi();

  if (['/temperature'].includes(location.pathname)) {
    return <DevFilterResults />;
    return <DevOrderProfile />;
  }

  if (['/', '/time'].includes(location.pathname)) {
    return <SessionAndTimers />;
  }

  // return <SessionAndTimers />;
  return <DevFilterResults />;
};
