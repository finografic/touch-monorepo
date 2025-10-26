import { DISPLAY_NAME, HeartbeatContext as Heartbeat } from './HeartbeatContext';
import type { HeartbeatProviderProps } from './HeartbeatContext.types';

export const HeartbeatProvider = ({ initialValue, children }: HeartbeatProviderProps) => {
  return <Heartbeat.Provider initialValue={initialValue}>{children}</Heartbeat.Provider>;
};

HeartbeatProvider.displayName = `${DISPLAY_NAME}Provider`;
