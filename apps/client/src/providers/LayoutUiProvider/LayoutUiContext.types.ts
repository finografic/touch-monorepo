import type { SlotMeta } from 'pages/MainPage/MainPage.types';
import type { ReactNode } from 'react';

import type { DataEntry } from 'types/data.types';
import type { ValidGridSize } from 'types/menu.types';
import type { FilterKey } from 'types/orders.types';
import type { PadConfig, PadType, PadUI } from 'types/pads.types';
import type { CreateSettersType } from 'utils/zustand';
import type { HandleRouteChangeParams } from './layout-ui-utils.types';
import type { LayoutUiKeys, SETTER_PREFIX } from './LayoutUiContext';

export interface LayoutUiValues {
  [LayoutUiKeys.numItems]: ValidGridSize;
  [LayoutUiKeys.filterKey]: FilterKey | undefined;
  [LayoutUiKeys.numPads]: number;
  [LayoutUiKeys.pads]: PadUI[];
  [LayoutUiKeys.padsFiltered]: PadUI[];
  [LayoutUiKeys.mainPageSelectedSlots]: SlotMeta[];
  [LayoutUiKeys.mainPageIsSelectMode]: boolean;
}

type LayoutUiSetters = CreateSettersType<LayoutUiValues, typeof SETTER_PREFIX>;

type LayoutUiActions = LayoutUiSetters & {
  initPadsFromLoaderData: (loaderData: DataEntry[], padsConfig: PadConfig, filterKey: FilterKey) => void;
  updatePadState: (filterKey: FilterKey, updater: (pads: PadUI[]) => PadUI[]) => void;
  togglePad: (filterKey: FilterKey, padId: string, type: PadType) => void;
  handleRouteChange: (params: HandleRouteChangeParams) => void;
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
