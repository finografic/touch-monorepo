import type { ReactNode } from 'react';
import type { CreateSettersType } from '@finografic/zustand-context-creator';
import type { RegionLocale } from '@workspace/i18n';

import type { SlotMeta } from 'pages/MainPage/MainPage.types';

import type { DataEntry } from 'types/data.types';
import type { PadConfig, PadType, PadUI } from 'types/pads.types';
import type { FilterKey } from 'types/slots.types';
import type { HandleRouteChangeParams } from './layout-ui-utils.types';
import type { LayoutUiKeys, SETTER_PREFIX } from './LayoutUiContext';

export interface LayoutUiValues {
  [LayoutUiKeys.filterKey]: FilterKey | undefined;
  [LayoutUiKeys.numPads]: number;
  [LayoutUiKeys.pads]: PadUI[];
  [LayoutUiKeys.padsFiltered]: PadUI[];
  [LayoutUiKeys.selectedSlots]: SlotMeta[];
  [LayoutUiKeys.mainPageIsSelectMode]: boolean;
}

type LayoutUiSetters = CreateSettersType<LayoutUiValues, typeof SETTER_PREFIX>;

type LayoutUiActions = LayoutUiSetters & {
  initPadsFromLoaderData: (
    loaderData: DataEntry[],
    padsConfig: PadConfig,
    filterKey: FilterKey,
    currentLanguage?: RegionLocale,
  ) => void;
  updatePadState: (filterKey: FilterKey, updater: (pads: PadUI[]) => PadUI[]) => void;
  togglePad: (filterKey: FilterKey, padId: string, type: PadType) => void;
  // MainPage selection actions
  toggleMainPageSlot: (slot: SlotMeta) => void;
  setSelectedSlots: (slots: SlotMeta[]) => void;
  handleRouteChange?: (params: HandleRouteChangeParams) => void;
};

export interface LayoutUiProviderProps {
  initialValue?: Partial<LayoutUiValues>;
  children: ReactNode;
}

export interface LayoutUiStore extends LayoutUiValues {
  actions: LayoutUiActions;
}
