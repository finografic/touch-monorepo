import type { ReactNode } from 'react';
import type { DevKeys, SETTER_PREFIX } from './DevContext';
import type { CreateSettersType } from 'utils/zustand';

export interface DevValues {
  [DevKeys.isDevToolsVisible]: boolean;
  [DevKeys.isDevQueryPanelOpen]: boolean;
  [DevKeys.isDevDataVisible]: boolean;
  [DevKeys.isDevScreenSizeVisible]: boolean;
}

type DevSetters = CreateSettersType<DevValues, typeof SETTER_PREFIX>;

type DevActions = DevSetters & {};

export interface DevProviderProps {
  initialValue?: DevStore;
  children: ReactNode;
}

export interface DevStore extends DevValues {
  actions: DevActions;
}
