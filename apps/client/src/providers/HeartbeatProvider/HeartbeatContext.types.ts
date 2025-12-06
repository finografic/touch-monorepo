import type { ReactNode } from 'react';

import type { CreateSettersType } from '@finografic/zustand-context-creator';
import type { HeartbeatKeys, SETTER_PREFIX } from './HeartbeatContext';

export interface HeartbeatValues {
  [HeartbeatKeys.tick]: number;
  [HeartbeatKeys.now]: number;
}

type HeartbeatSetters = CreateSettersType<HeartbeatValues, typeof SETTER_PREFIX>;

type HeartbeatActions = HeartbeatSetters & {
  start: () => void;
  stop: () => void;
};

export interface HeartbeatProviderProps {
  initialValue?: HeartbeatStore;
  children: ReactNode;
}

export interface HeartbeatStore extends HeartbeatValues {
  actions: HeartbeatActions;
}
