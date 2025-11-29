import { DISPLAY_NAME, TimersContext } from './TimersContext';
import type { TimersProviderProps } from './TimersContext.types';

export const TimersProvider = ({ initialValue, children }: TimersProviderProps) => {
  return <TimersContext.Provider initialValue={initialValue}>{children}</TimersContext.Provider>;
};

TimersProvider.displayName = `${DISPLAY_NAME}Provider`;
