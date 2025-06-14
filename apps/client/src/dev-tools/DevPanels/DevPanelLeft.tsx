import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useLocation } from 'react-router-dom';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { PADS_UI_CONFIG } from 'constants/ui.config';
import { transformPadData } from 'utils/data.utils';
import { stylesLeft } from './DevPanels.styles';

export const DevPanelLeft = () => {
  const location = useLocation();
  const { fieldKey } = useRouteConfig();
  const { pads: padsSource } = useLayoutUi();

  const padsConfig = PADS_UI_CONFIG[fieldKey];

  const devDataLeft = {
    pathname: location.pathname,
    fieldKey,
    config: padsConfig,
    pads: transformPadData(padsSource),
  };

  return (
    <aside id="dev-data-left" css={stylesLeft}>
      <pre>{JSON.stringify(devDataLeft, null, 2)}</pre>
    </aside>
  );
};
