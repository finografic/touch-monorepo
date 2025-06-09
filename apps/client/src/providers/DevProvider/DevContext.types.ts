import type { ReactNode } from 'react';
import type { DevKeys, SETTER_PREFIX } from './DevContext';

export interface DevValues {
  [DevKeys.isDevToolsVisible]: boolean;
  [DevKeys.isDevQueryPanelOpen]: boolean;
  [DevKeys.isDevDataVisible]: boolean;
}

type DevSetters = {
  [K in keyof DevValues as DevValues[K] extends boolean
    ? `set${Capitalize<string & K>}`
    : `set${typeof SETTER_PREFIX}${Capitalize<string & K>}`]: (val: DevValues[K]) => void;
};

type DevActions = DevSetters & {};

export interface DevProviderProps {
  initialValue?: DevStore;
  children: ReactNode;
}

export interface DevStore extends DevValues {
  actions: DevActions;
}
