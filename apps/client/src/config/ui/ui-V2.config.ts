import { SlotFilterKeys } from 'config/app';
import { FilterKeys } from 'config/app';
import type { SlotFilterKey } from 'types/orders.types';
import type { PadConfig, PadUI } from 'types/pads.types';
import { getLabelKey } from 'utils/localization.utils';

/**
 * Gets the UI configuration for pads with dynamic language support
 * @param currentLanguage - Current language to determine label keys
 */
export const getPadsUIConfig = (currentLanguage: 'en' | 'es' | 'ca'): Record<SlotFilterKey, PadConfig> => {
  const labelKey = getLabelKey(currentLanguage);

  return {
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
      labelKey,
      valueKeys: ['id', 'name', 'hasSubtypes', 'defaultTempConsume'],
      maxPads: 10,
      minRequired: 1,
    },
    [SlotFilterKeys.drinkSubtype]: {
      filterKey: FilterKeys.drinkSubtypeName,
      type: 'radio',
      labelKey,
      valueKeys: ['id', 'name', 'defaultTempConsume'],
      maxPads: 10,
      minRequired: 1,
    },
    [SlotFilterKeys.drinkVolume]: {
      filterKey: FilterKeys.volumeName,
      type: 'radio',
      labelKey,
      valueKeys: ['id', 'name'],
      maxPads: 10,
      minRequired: 1,
    },
    [SlotFilterKeys.containerType]: {
      filterKey: FilterKeys.containerTypeName,
      type: 'radio',
      labelKey,
      valueKeys: ['id', 'name'],
      maxPads: 10,
      minRequired: 1,
    },
    [SlotFilterKeys.temperature]: {
      filterKey: FilterKeys.temperature,
      type: 'radio',
      labelKey,
      valueKeys: ['id', 'name'],
      maxPads: 10,
      minRequired: 1,
    },
  };
};

// Legacy static config (for backward compatibility) - now defaults to Spanish
export const PADS_UI_CONFIG: Record<SlotFilterKey, PadConfig> = getPadsUIConfig('es');

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
