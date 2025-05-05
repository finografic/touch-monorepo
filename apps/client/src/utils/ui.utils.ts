import type { PadsConfig, PadType, PadUI } from 'types/ui.types';
import type { DataEntry } from 'types/data.types';
import type { OrderFieldKey } from 'types/orders.types';

// -------------------------------------------------------------------------- //
// NOTE: Initialize an array of pad items with default values

export const initAllPadUI = ({
  numPads = 0,
  ids = [],
  labels = [],
  name = '',
  type = 'radio',
  metadata = [],
  initChecked = () => false,
}: {
  numPads: number;
  ids: string[];
  labels?: string[];
  name: string;
  type: PadType;
  metadata?: DataEntry[];
  initChecked?: (pad: PadUI) => boolean;
}): PadUI[] => {
  return numPads > 0
    ? Array.from({ length: numPads }, (_, i) => {
        const pad: PadUI = {
          index: i,
          id: ids[i],
          label: labels[i],
          name,
          type,
          isChecked: false,
          metadata: metadata[i],
        };
        pad.isChecked = initChecked(pad);
        return pad;
      })
    : [];
};

// -------------------------------------------------------------------------- //
// NOTE: Parse loader data and config to initialize pad items

export const parsePadsConfig = <T extends DataEntry>({
  data = [],
  config,
  fieldKey,
}: {
  data: T[];
  config: PadsConfig<T>;
  fieldKey: OrderFieldKey;
}): { pads: PadUI[]; numPads: number } => {
  const { maxPads, type, initChecked } = config;
  const labelKey = (config.labelKey as keyof T) || ('displayName' as keyof T); // NOTE: which key to use for label
  const numPads = Math.min(data.length, maxPads);
  const slicedData = data.slice(0, numPads);

  const ids = slicedData.map((item) => String(item?.name ?? item?.id ?? '')) ?? [];
  const labels = labelKey ? slicedData.map((item) => String(item[labelKey] ?? '')) : [];

  const pads = initAllPadUI({
    numPads,
    ids,
    labels,
    name: fieldKey,
    type,
    metadata: slicedData,
    initChecked,
  });

  return { pads, numPads };
};
