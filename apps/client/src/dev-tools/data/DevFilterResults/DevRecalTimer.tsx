import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';

import { styles } from './DevFilterResults.styles';
import { useTimers } from 'providers/TimersProvider';

export const DevRecallTimer = () => {
  const { selectedSlots } = useLayoutUi();
  const { recall } = useTimers();

  return (
    <div id="dev-filter-results" css={styles}>
      <div className="filters">
        <h4>snooze, timers: {selectedSlots.length}:</h4>
        <pre>{JSON.stringify({ selectedSlots }, null, 2)}</pre>
      </div>
      <div className="filters">
        <h4>RECALL TIMER::</h4>
        <pre>{JSON.stringify({ recall }, null, 2)}</pre>
      </div>
    </div>
  );
};
