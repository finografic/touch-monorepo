import { DISPLAY_NAME, TimersContext } from './TimerContext';
import type { TimersProviderProps } from './TimerContext.types';

export const TimersProvider = ({ initialValue, children }: TimersProviderProps) => {
  return <TimersContext.Provider initialValue={initialValue}>{children}</TimersContext.Provider>;
};

TimersProvider.displayName = `${DISPLAY_NAME}Provider`;
