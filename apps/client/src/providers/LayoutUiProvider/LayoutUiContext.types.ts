import type { ReactNode } from 'react';
import type { LayoutUiKeys, SETTER_PREFIX } from './LayoutUiContext';
import type { ValidGridSize } from 'types/menu.types';
import type { PadConfig, PadType, PadUI } from 'types/pads.types';
import type { FilterFieldKey } from 'types/orders.types';
import type { DataEntry } from 'types/data.types';
import type { RegionLocale } from '@workspace/i18n';
import type { OrderModel } from 'types/models/order.model';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { CreateSettersType } from 'utils/zustand';
import type { SlotMeta } from 'pages/MainPage/MainPage.types';

export interface LayoutUiValues {
  [LayoutUiKeys.numItems]: ValidGridSize;
  [LayoutUiKeys.fieldKey]: FilterFieldKey | undefined;
  [LayoutUiKeys.numPads]: number;
  [LayoutUiKeys.pads]: PadUI[];
  [LayoutUiKeys.padsFiltered]: PadUI[];
  [LayoutUiKeys.mainPageSelectedSlots]: SlotMeta[];
  [LayoutUiKeys.mainPageIsSelectMode]: boolean;
}

type LayoutUiSetters = CreateSettersType<LayoutUiValues, typeof SETTER_PREFIX>;

type LayoutUiActions = LayoutUiSetters & {
  initPadsFromLoaderData: (loaderData: DataEntry[], padsConfig: PadConfig, fieldKey: FilterFieldKey) => void;
  updatePadState: (fieldKey: FilterFieldKey, updater: (pads: PadUI[]) => PadUI[]) => void;
  togglePad: (fieldKey: FilterFieldKey, padId: string, type: PadType) => void;
  handleRouteChange: (
    fieldKey: FilterFieldKey | undefined,
    loaderData: DataEntry[],
    padsConfig: PadConfig,
    dataPool: DataEntry[] | OrderModel[] | OrderReadableModel[],
    serverFieldMap: Record<string, string>,
    currentLanguage?: RegionLocale,
  ) => void;
  // MainPage selection actions
  toggleMainPageSlot: (slot: SlotMeta) => void;
  selectAllMainPageSlots: () => void;
  clearMainPageSelection: () => void;
  setMainPageSelectedSlots: (slots: SlotMeta[]) => void;
};

export interface LayoutUiProviderProps {
  initialValue?: Partial<LayoutUiValues>;
  children: ReactNode;
}

export interface LayoutUiStore extends LayoutUiValues {
  actions: LayoutUiActions;
}
