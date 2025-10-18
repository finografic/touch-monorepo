import { useFiltersContext } from 'providers/FiltersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useTimers } from 'providers/TimersProvider';

import { DevDataTable } from 'dev-tools/components/DevDataTable';
import { styles } from './SessionAndTimers.styles';

export const SessionAndTimers = () => {
  const { filters } = useFiltersContext();
  const { sessions } = useSession();
  const { timers } = useTimers();
  const { mainPageSelectedSlots } = useLayoutUi();
  const { orders } = useOrders();

  const previousSessions = Object.values(sessions).filter((session) => !session.isActive) || [];
  const activeSession = Object.values(sessions).find((session) => session.isActive) || {};

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
        {previousSessions.length ? <h4>Sessions (previous) {Number(previousSessions.length)}:</h4> : null}
        <h4>Session ({Object.keys(activeSession).length}):</h4>
        <pre>{JSON.stringify(activeSession, null, 2)}</pre>
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
