import type { ReactNode } from 'react';
import type { DevKeys } from './DevContext';
import { DISPLAY_NAME } from './DevContext';

export interface DevValues {
  [DevKeys.title]: string;
  [DevKeys.isDevDataVisible]: boolean;
  [DevKeys.isDevQueryPanelOpen]: boolean;
}

type DevSetters = {
  [K in keyof DevValues as DevValues[K] extends boolean
    ? `set${Capitalize<string & K>}`
    : `set${typeof DISPLAY_NAME}${Capitalize<string & K>}`]: (val: DevValues[K]) => void;
};

type DevActions = DevSetters & {};

export interface DevProviderProps {
  initialValue?: DevStore;
  children: ReactNode;
}

export interface DevStore extends DevValues {
  actions: DevActions;
}
