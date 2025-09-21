import type { ReactNode } from 'react';
import type { LayoutUiKeys, SETTER_PREFIX } from './LayoutUiContext';
import type { ValidGridSize } from 'types/menu.types';
import type { PadConfig, PadType, PadUI } from 'types/ui.types';
import type { OrderFieldKey } from 'types/orders.types';
import type { DataEntry } from 'types/data.types';
import type { RegionLocale } from '@workspace/core/types';
import type { OrderModel } from 'types/models/order.model';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { CreateSettersType } from 'utils/zustand';

interface SlotMeta {
  slotType: SlotType;
  slotNumber: number;
  isChecked: boolean;
}

export interface LayoutUiValues {
  [LayoutUiKeys.numItems]: ValidGridSize;
  [LayoutUiKeys.fieldKey]: OrderFieldKey | undefined;
  [LayoutUiKeys.numPads]: number;
  [LayoutUiKeys.pads]: PadUI[];
  [LayoutUiKeys.padsFiltered]: PadUI[];
  [LayoutUiKeys.mainPageSelectedSlots]: number[];
  [LayoutUiKeys.mainPageIsSelectMode]: boolean;
}

type LayoutUiSetters = CreateSettersType<LayoutUiValues, typeof SETTER_PREFIX>;

type LayoutUiActions = LayoutUiSetters & {
  initPadsFromLoaderData: (loaderData: DataEntry[], padsConfig: PadConfig, fieldKey: OrderFieldKey) => void;
  updatePadState: (fieldKey: OrderFieldKey, updater: (pads: PadUI[]) => PadUI[]) => void;
  togglePad: (fieldKey: OrderFieldKey, padId: string, type: PadType) => void;
  handleRouteChange: (
    fieldKey: OrderFieldKey | undefined,
    loaderData: DataEntry[],
    padsConfig: PadConfig,
    dataPool: DataEntry[] | OrderModel[] | OrderReadableModel[],
    serverFieldMap: Record<string, string>,
    currentLanguage?: RegionLocale,
  ) => void;
  // MainPage selection actions
  toggleMainPageSlot: (slotNumber: number) => void;
  selectAllMainPageSlots: () => void;
  clearMainPageSelection: () => void;
};

export interface LayoutUiProviderProps {
  initialValue?: Partial<LayoutUiValues>;
  children: ReactNode;
}

export interface LayoutUiStore extends LayoutUiValues {
  actions: LayoutUiActions;
}
