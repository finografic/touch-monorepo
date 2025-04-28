import type { ReactNode } from 'react';
import type { DISPLAY_NAME, LayoutUiKeys } from './LayoutUiContext';
import type { ValidTypeBCount } from 'types/menu.types';

export interface LayoutUiValues {
  [LayoutUiKeys.numSlots]: ValidTypeBCount;
  [LayoutUiKeys.selections]: number[];
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
