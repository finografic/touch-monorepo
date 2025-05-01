import type { ReactNode } from 'react';
import type { DISPLAY_NAME, LayoutUiKeys } from './LayoutUiContext';
import type { ValidTypeBCount } from 'types/menu.types';
import type { PadItem } from 'types/ui.types';
import type { OrderField } from 'types/orders.types';

export interface LayoutUiValues {
  [LayoutUiKeys.numSlots]: ValidTypeBCount;
  [LayoutUiKeys.fieldKey]: OrderField | undefined;
  [LayoutUiKeys.numPads]: number;
  [LayoutUiKeys.pads]: PadItem[];
}

type LayoutUiSetters = {
  [K in keyof LayoutUiValues as LayoutUiValues[K] extends boolean
    ? `set${Capitalize<string & K>}`
    : `set${typeof DISPLAY_NAME}${Capitalize<string & K>}`]: (val: LayoutUiValues[K]) => void;
};

type LayoutUiActions = LayoutUiSetters & {};

export interface LayoutUiProviderProps {
  initialValue?: LayoutUiStore;
  children: ReactNode;
}

export interface LayoutUiStore extends LayoutUiValues {
  actions: LayoutUiActions;
}
