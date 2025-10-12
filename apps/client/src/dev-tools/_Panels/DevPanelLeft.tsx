import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useLocation } from 'react-router-dom';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { transformPadData } from 'utils/data.utils';
import { DevFilterResults } from 'dev-tools/data/DevFilterResults/DevFilterResults';
import { stylesLeft } from './DevPanels.styles';
import { DevOrderProfile } from 'dev-tools/data/DevOrderProfile/DevOrderProfile';
import { SessionAndTimers } from 'dev-tools/data/SessionAndTimers/SessionAndTimers';

export const DevPanelLeft = () => {
  const location = useLocation();
  const { filterFieldKey, padsConfig } = useRouteConfig();
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

  const devDataLeft = {
    pathname: location.pathname,
    filterFieldKey,
    config: padsConfig,
    pads: transformPadData(padsSource),
  };

  return (
    <aside id="dev-data-left" css={stylesLeft}>
      {/* <pre>{JSON.stringify(devDataLeft, null, 2)}</pre> */}
    </aside>
  );
};
