import type { PadItem, PadsConfig, PadType } from 'types/ui.types';
import type { DataEntry } from 'types/data.types';

/** Initialize an array of pad items with default values */
export const initPadItems = ({
  numPads = 0,
  keys = [],
  type = 'radio',
  metadata = [],
}: {
  numPads: number;
  keys?: string[];
  type: PadType;
  metadata?: DataEntry[];
}): PadItem[] => {
  return numPads > 0
    ? Array.from({ length: numPads }, (_, i) => ({
        key: keys[i],
        type,
        isChecked: false,
        metadata: metadata[i],
      }))
    : [];
};

/** Initialize a single pad item */
export const initPadItem = ({
  key,
  type = 'radio',
  isChecked = false,
  metadata,
}: {
  key: string;
  type: PadType;
  isChecked: boolean;
  metadata?: DataEntry;
}): PadItem => {
  return {
    key,
    type,
    isChecked,
    metadata,
  };
};

/** Parse loader data and config to initialize pad items */
export const parsePadsConfig = <T extends DataEntry>({
  data = [],
  config,
}: {
  data: T[];
  config: PadsConfig<T>;
}): { pads: PadItem[]; numPads: number } => {
  const { maxPads, type, labelKey } = config;
  const numPads = Math.min(data.length, maxPads);

  // Slice the data to maxPads length
  const slicedData = data.slice(0, numPads);

  // Extract keys from data using the configured labelKey
  const keys = labelKey ? slicedData.map((item) => String(item[labelKey] ?? '')) : [];

  // Initialize pads with the extracted keys and metadata
  const pads = initPadItems({ numPads, keys, type, metadata: slicedData });

  return { pads, numPads };
};
