import type { ReactNode } from 'react';
import type { DevGuidesKeys, SETTER_PREFIX } from './DevGuidesContext';
import type { CreateSettersType } from 'utils/zustand';

export interface DevGuidesValues {
  [DevGuidesKeys.isDevGuidesVisibile]: boolean;
}

type DevGuidesSetters = CreateSettersType<DevGuidesValues, typeof SETTER_PREFIX>;

type DevGuidesActions = DevGuidesSetters & {};

export interface DevGuidesProviderProps {
  initialValue?: DevGuidesStore;
  children: ReactNode;
}

export interface DevGuidesStore extends DevGuidesValues {
  actions: DevGuidesActions;
}
