import type { TimersProviderProps } from './TimerContext.types';
import { DISPLAY_NAME, TimersContext } from './TimerContext';

export const TimersProvider = ({ initialValue, children }: TimersProviderProps) => {
  return <TimersContext.Provider initialValue={initialValue}>{children}</TimersContext.Provider>;
};

TimersProvider.displayName = `${DISPLAY_NAME}Provider`;
