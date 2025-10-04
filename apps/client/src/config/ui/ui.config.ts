import { SlotFilterKeys } from 'config/app';
import { FilterKeys } from 'config/app';
import type { SlotFilterKey } from 'types/orders.types';
import type { PadConfig, PadUI } from 'types/pads.types';

export const PADS_UI_CONFIG: Record<SlotFilterKey, PadConfig> = {
  [SlotFilterKeys.main]: {
    type: 'checkbox',
    labelKey: 'name',
    valueKeys: ['id', 'name'],
    maxPads: 2,
    minRequired: 1,
  },
  [SlotFilterKeys.drinkType]: {
    filterKey: FilterKeys.drinkTypeName,
    type: 'radio',
    labelKey: 'nameEn',
    valueKeys: ['id', 'name', 'hasSubtypes', 'defaultTempConsume'],
    maxPads: 10,
    minRequired: 1,
  },
  [SlotFilterKeys.drinkSubtype]: {
    filterKey: FilterKeys.drinkSubtypeName,
    type: 'radio',
    labelKey: 'nameEn',
    valueKeys: ['id', 'name', 'defaultTempConsume'],
    maxPads: 10,
    minRequired: 1,
  },
  [SlotFilterKeys.drinkVolume]: {
    filterKey: FilterKeys.volumeName,
    type: 'radio',
    labelKey: 'name',
    valueKeys: ['id', 'name'],
    maxPads: 10,
    minRequired: 1,
  },
  [SlotFilterKeys.containerType]: {
    filterKey: FilterKeys.containerTypeName,
    type: 'radio',
    labelKey: 'nameEn',
    valueKeys: ['id', 'name'],
    maxPads: 10,
    minRequired: 1,
  },
  [SlotFilterKeys.temperature]: {
    filterKey: FilterKeys.temperature,
    type: 'radio',
    labelKey: 'nameEn',
    valueKeys: ['id', 'name'],
    maxPads: 10,
    minRequired: 1,
  },
};

export const INITIAL_PAD_CHECKBOX: PadUI = {
  index: 0,
  id: '',
  label: '',
  name: '' as SlotFilterKey,
  value: {
    name: '',
    id: '',
  },
  type: 'checkbox',
  isChecked: false,
};

export const INITIAL_PAD_RADIO: PadUI = {
  index: 0,
  id: '',
  label: '',
  name: '' as SlotFilterKey,
  value: {
    name: '',
    id: '',
  },
  type: 'radio',
  isChecked: false,
};
