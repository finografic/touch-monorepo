import type { ReactNode } from 'react';
import { DevLayerKeys } from './DevLayerContext';

export type DevLayerValues = {
  [DevLayerKeys.isToolbarOpen]: boolean;
};

// SETTERS
type DevLayerSetters = {
  [K in keyof DevLayerValues as `set${Capitalize<string & K>}`]: (val: DevLayerValues[K]) => void;
};

// ACTIONS
type DevLayerActions = DevLayerSetters & {
  resetHeader: () => void;
};

export type DevLayerProviderProps = {
  initialValue?: DevLayerStore;
  children: ReactNode;
};

export interface DevLayerStore extends DevLayerValues {
  actions: DevLayerActions;
}
