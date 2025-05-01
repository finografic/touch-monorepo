import type { ReactNode } from 'react';
import type { LayoutUiKeys, SETTER_PREFIX } from './LayoutUiContext';
import type { ValidTypeBCount } from 'types/menu.types';
import type { PadItem } from 'types/ui.types';
import type { OrderField } from 'types/orders.types';
import type { DrinkType } from 'types/models/drink-type.model';

export interface LayoutUiValues {
  [LayoutUiKeys.numSlots]: ValidTypeBCount;
  [LayoutUiKeys.fieldKey]: OrderField | undefined;
  [LayoutUiKeys.numPads]: number;
  [LayoutUiKeys.pads]: PadItem[];
}

type LayoutUiSetters = {
  [K in keyof LayoutUiValues as LayoutUiValues[K] extends boolean
    ? `set${Capitalize<string & K>}`
    : `set${typeof SETTER_PREFIX}${Capitalize<string & K>}`]: (val: LayoutUiValues[K]) => void;
};

type LayoutUiActions = LayoutUiSetters & {
  updateFromDrinkTypes: (drinkTypes: DrinkType[] | undefined) => void;
};

export interface LayoutUiProviderProps {
  initialValue?: LayoutUiStore;
  children: ReactNode;
}

export interface LayoutUiStore extends LayoutUiValues {
  actions: LayoutUiActions;
}
