import { styles } from './SessionAndTimers.styles';
import { type TimerItem, useTimers } from 'providers/TimersProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';

export const SessionAndTimers = () => {
  const { sessions } = useSession();
  const { timers } = useTimers();

  return (
    <div id="dev-filter-results" css={styles}>
      <div className="filters">
        <h4>Session ({Object.keys(sessions).length}):</h4>
        {/* <pre>{JSON.stringify(sessions, null, 2)}</pre> */}
      </div>
      <div className="results-list">
        <h4>Timers: {timers.length}</h4>
        <pre>{JSON.stringify(timers, null, 2)}</pre>
        {timers.map((timer: TimerItem) => (
          <div key={timer.id} className="result-row">
            <div className="result-col" style={{ flex: 0.5 }}>
              <strong>{timer.orderId}</strong>
            </div>
            <div className="result-col" style={{ flex: 0.5 }}>
              <p style={{ margin: 0 }}>{timer.remaining}s</p>
            </div>
            <div className="result-col" style={{ flex: 0.5 }}>
              <p style={{ margin: 0 }}>{timer.duration}s</p>
            </div>
            <div className="result-col" style={{ flex: 0.5 }}>
              <p style={{ margin: 0 }}>{timer.status}</p>
            </div>
            <div className="result-col" style={{ flex: 0.5 }}>
              <p style={{ margin: 0 }}>{timer.flowType}</p>
            </div>
            <div className="result-col" style={{ flex: 1 }}>
              <strong style={{ opacity: 0.33 }}>{timer.sessionId.slice(-8)}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
