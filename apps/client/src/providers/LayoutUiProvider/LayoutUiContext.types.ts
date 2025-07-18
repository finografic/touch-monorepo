import type { ReactNode } from 'react';
import type { LayoutUiKeys, SETTER_PREFIX } from './LayoutUiContext';
import type { ValidGridSize } from 'types/menu.types';
import type { PadConfig, PadType, PadUI } from 'types/ui.types';
import type { OrderFieldKey } from 'types/orders.types';
import type { DataEntry } from 'types/data.types';
import type { RegionLocale } from '@workspace/core/types';
import type { OrderModel } from 'types/models/order.model';

export interface LayoutUiValues {
  [LayoutUiKeys.numItems]: ValidGridSize;
  [LayoutUiKeys.fieldKey]: OrderFieldKey | undefined;
  [LayoutUiKeys.numPads]: number;
  [LayoutUiKeys.pads]: PadUI[];
  [LayoutUiKeys.padsFiltered]: PadUI[];
}

type LayoutUiSetters = {
  [K in keyof LayoutUiValues as LayoutUiValues[K] extends boolean
    ? `set${Capitalize<string & K>}`
    : `set${typeof SETTER_PREFIX}${Capitalize<string & K>}`]: (val: LayoutUiValues[K]) => void;
};

type LayoutUiActions = LayoutUiSetters & {
  initPadsFromLoaderData: (loaderData: DataEntry[], padsConfig: PadConfig, fieldKey: OrderFieldKey) => void;
  updatePadState: (fieldKey: OrderFieldKey, updater: (pads: PadUI[]) => PadUI[]) => void;
  togglePad: (fieldKey: OrderFieldKey, padId: string, type: PadType) => void;
  handleRouteChange: (
    fieldKey: OrderFieldKey | undefined,
    loaderData: DataEntry[],
    padsConfig: PadConfig,
    dataPool: DataEntry[] | OrderModel[],
    serverFieldMap: Record<string, string>,
    currentLanguage?: RegionLocale,
  ) => void;
};

export interface LayoutUiProviderProps {
  initialValue?: Partial<LayoutUiValues>;
  children: ReactNode;
}

export interface LayoutUiStore extends LayoutUiValues {
  actions: LayoutUiActions;
}
