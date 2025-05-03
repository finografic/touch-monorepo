import type { PadItem, PadsConfig, PadType } from 'types/ui.types';
import type { DataEntry } from 'types/data.types';

/** Initialize an array of pad items with default values */
export const initPadItems = ({
  numPads = 0,
  keys = [],
  type = 'radio',
}: {
  numPads: number;
  keys?: string[];
  type: PadType;
}): PadItem[] => {
  return numPads > 0
    ? Array.from({ length: numPads }, (_, i) => ({
        key: keys[i],
        type,
        isChecked: false,
      }))
    : [];
};

/** Initialize a single pad item */
export const initPadItem = ({
  key,
  type = 'radio',
  isChecked = false,
}: {
  key: string;
  type: PadType;
  isChecked: boolean;
}): PadItem => {
  return {
    key,
    type,
    isChecked,
  };
};

/** Parse loader data and config to initialize pad items */
export const parsePadsConfig = ({
  data = [],
  config,
}: {
  data: DataEntry[];
  config: PadsConfig;
}): { pads: PadItem[]; numPads: number } => {
  const { maxPads, type, labelKey } = config;
  const numPads = Math.min(data.length, maxPads);

  // Extract keys from data using the configured labelKey
  const keys = data.slice(0, numPads).map((item) => (item as Record<string, string>)[labelKey] || '');

  // Initialize pads with the extracted keys
  const pads = initPadItems({ numPads, keys, type });

  return { pads, numPads };
};
