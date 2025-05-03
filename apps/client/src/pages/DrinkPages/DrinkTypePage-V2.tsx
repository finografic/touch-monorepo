import { stylesItemsGrid } from './grid.styles';
import type { DrinkType } from 'types/models/drink-type.model';
import { useEffect } from 'react';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { NoItems } from 'components/NoItems/NoItems';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { OrderFieldKeys } from 'src/config/app.config';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import type { PadItem } from 'types/ui.types';
import { Pad } from 'components/Pad/Pad';

export const DrinkTypePage = () => {
  const { fieldKey } = useRouteConfig();
  const { pads } = useLayoutUi();
  const { orders } = useOrders();

  if (!pads?.length) {
    return <NoItems message="No drink types found" />;
  }

  return (
    <section css={stylesItemsGrid}>
      <div className={getGridFlowClasses(pads.length)}>
        {pads.map((pad: PadItem) => (
          <Pad key={pad.key} pad={pad} fieldKey={fieldKey} className="item-button" />
        ))}
      </div>
    </section>
  );
};
