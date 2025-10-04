import { API_FILTER_FIELDS, ROUTE_FILTER_KEYS } from 'config/app';
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
    [ROUTE_FILTER_KEYS.main]: {
      type: 'checkbox',
      labelKey: 'name',
      valueKeys: ['id', 'name'],
      maxPads: 2,
      minRequired: 1,
    },
    [ROUTE_FILTER_KEYS.drinkType]: {
      filterKey: API_FILTER_FIELDS.drinkTypeName,
      type: 'radio',
      labelKey,
      valueKeys: ['id', 'name', 'hasSubtypes', 'defaultTempConsume'],
      maxPads: 10,
      minRequired: 1,
    },
    [ROUTE_FILTER_KEYS.drinkSubtype]: {
      filterKey: API_FILTER_FIELDS.drinkSubtypeName,
      type: 'radio',
      labelKey,
      valueKeys: ['id', 'name', 'defaultTempConsume'],
      maxPads: 10,
      minRequired: 1,
    },
    [ROUTE_FILTER_KEYS.drinkVolume]: {
      filterKey: API_FILTER_FIELDS.volumeName,
      type: 'radio',
      labelKey,
      valueKeys: ['id', 'name'],
      maxPads: 10,
      minRequired: 1,
    },
    [ROUTE_FILTER_KEYS.containerType]: {
      filterKey: API_FILTER_FIELDS.containerTypeName,
      type: 'radio',
      labelKey,
      valueKeys: ['id', 'name'],
      maxPads: 10,
      minRequired: 1,
    },
    [ROUTE_FILTER_KEYS.temperature]: {
      filterKey: API_FILTER_FIELDS.temperature,
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
