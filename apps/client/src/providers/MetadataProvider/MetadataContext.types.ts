import type { ReactNode } from 'react';
import type { CreateSettersType } from '@finografic/zustand-context-creator';

import type { SlotMeta } from 'pages/MainPage/MainPage.types';

import type { MetadataKeys, SETTER_PREFIX } from './MetadataContext';

export interface MetadataValues {
  /** i18n key or raw string for the current page title (document + header sync). */
  [MetadataKeys.title]: string;
  /** Main grid slot selection; root-mounted so it survives Layout unmount (e.g. Admin). */
  [MetadataKeys.selectedSlots]: SlotMeta[];
}

type MetadataSetters = CreateSettersType<MetadataValues, typeof SETTER_PREFIX>;

export type MetadataActions = MetadataSetters & {
  toggleSlot: (slot: SlotMeta) => void;
  setSelectedSlots: (slots: SlotMeta[]) => void;
};

export interface MetadataStore extends MetadataValues {
  actions: MetadataActions;
}

export interface MetadataProviderProps {
  initialValue?: Partial<MetadataValues>;
  children: ReactNode;
}
