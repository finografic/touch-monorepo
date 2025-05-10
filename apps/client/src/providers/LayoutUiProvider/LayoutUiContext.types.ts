import type { ReactNode } from 'react';
import type { LayoutUiKeys, SETTER_PREFIX } from './LayoutUiContext';
import type { ValidTypeBCount } from 'types/menu.types';
import type { PadsConfig, PadUI } from 'types/ui.types';
import type { OrderFieldKey } from 'types/orders.types';
import type { DataEntry } from 'types/data.types';

export interface LayoutUiValues {
  [LayoutUiKeys.numItems]: ValidTypeBCount;
  [LayoutUiKeys.fieldKey]: OrderFieldKey | undefined;
  [LayoutUiKeys.numPads]: number;
  [LayoutUiKeys.pads]: PadUI[];
}

type LayoutUiSetters = {
  [K in keyof LayoutUiValues as LayoutUiValues[K] extends boolean
    ? `set${Capitalize<string & K>}`
    : `set${typeof SETTER_PREFIX}${Capitalize<string & K>}`]: (val: LayoutUiValues[K]) => void;
};

type LayoutUiActions = LayoutUiSetters & {
  initPadsFromLoaderData: (loaderData: DataEntry[], padsConfig: PadsConfig, fieldKey: OrderFieldKey) => void;
  updatePadState: (fieldKey: OrderFieldKey, updater: (pads: PadUI[]) => PadUI[]) => void;
  togglePad: (fieldKey: OrderFieldKey, padId: string, type: 'checkbox' | 'radio') => void;
};

export interface LayoutUiProviderProps {
  initialValue?: Partial<LayoutUiValues>;
  children: ReactNode;
}

export interface LayoutUiStore extends LayoutUiValues {
  actions: LayoutUiActions;
}
