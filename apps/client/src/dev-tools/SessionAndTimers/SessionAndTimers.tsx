import { styles } from './SessionAndTimers.styles';
import { useTimers } from 'providers/TimersProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { DevDataTable } from 'dev-tools/DevDataTable';
import { useFilters } from 'providers/FiltersProvider';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';

export const SessionAndTimers = () => {
  const { filters } = useFilters();
  const { sessions } = useSession();
  const { timers } = useTimers();
  const { mainPageSelectedSlots } = useLayoutUi();
  const { orders } = useOrders();

  return (
    <div id="dev-filter-results" css={styles}>
      <div className="filters">
        <h4>mainPageSelectedSlots: {mainPageSelectedSlots.length}:</h4>
        <pre>{JSON.stringify(mainPageSelectedSlots, null, 2)}</pre>
      </div>
      {/* <div className="filters">
        <h4>orders: {orders.length}:</h4>
        <pre>{JSON.stringify(orders, null, 2)}</pre>
      </div> */}
      {/* <div className="filters">
        <h4>Filters ({Object.keys(filters).length}):</h4>
        <pre>{JSON.stringify(filters?.temperature, null, 2)}</pre>
      </div> */}
      <div className="filters">
        <h4>Session ({Object.keys(sessions).length}):</h4>
        <pre>{JSON.stringify(sessions, null, 2)}</pre>
      </div>

      <div className="results-list">
        {/* <h4>Timers: {timers.length}</h4> */}
        {/* <pre>{JSON.stringify(timers, null, 2)}</pre> */}
        <DevDataTable
          data={timers}
          title={`Timers: ${timers.length}`}
          columns={[
            { key: 'orderId', strong: true },
            { key: 'remaining', styles: { margin: 0 } },
            { key: 'duration', styles: { margin: 0 } },
            { key: 'status', styles: { margin: 0 } },
            { key: 'flowType', styles: { margin: 0 } },
            { key: 'sessionId', strong: true, styles: { opacity: 0.33 } },
          ]}
        />
      </div>
    </div>
  );
};
