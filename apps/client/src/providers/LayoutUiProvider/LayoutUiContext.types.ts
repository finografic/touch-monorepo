import type { ReactNode } from 'react';
import type { LayoutUiKeys } from './LayoutUiContext';
import { DISPLAY_NAME } from './LayoutUiContext';

export interface LayoutUiValues {
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
