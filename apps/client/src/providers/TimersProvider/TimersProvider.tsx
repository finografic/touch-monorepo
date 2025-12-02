import { DISPLAY_NAME, TimersContext } from './TimersContext';
import type { TimersProviderProps } from './TimersContext.types';
import { useRelayTimerControl } from 'hooks/useRelayTimerControl';

// Passive controller component that centralizes relay ON/OFF control
// based on timer status. Mounted once inside TimersProvider so that
// relay control works from any route (MainPage, Admin, etc.).
const RelayTimersController = () => {
  useRelayTimerControl();
  return null;
};

export const TimersProvider = ({ initialValue, children }: TimersProviderProps) => {
  return (
    <TimersContext.Provider initialValue={initialValue}>
      <RelayTimersController />
      {children}
    </TimersContext.Provider>
  );
};

TimersProvider.displayName = `${DISPLAY_NAME}Provider`;
