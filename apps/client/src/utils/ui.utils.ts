import type { PadsConfig, PadType, PadUI } from 'types/ui.types';
import type { DataEntry } from 'types/data.types';
import type { OrderFieldKey /* , OrderFilters, OrderItem */ } from 'types/orders.types';
import { PAD_TYPE } from 'types/ui.types';
import { OrderFieldKeys } from 'constants/app.config';

// -------------------------------------------------------------------------- //
// NOTE: Initialize an array of pad items with default values

export const initAllPadUI = ({
  numPads = 0,
  ids = [],
  labels = [],
  name = '',
  type = PAD_TYPE.RADIO,
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
          value: metadata[i],
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

// -------------------------------------------------------------------------- //
// NOTE: Update pad state

export const getPadIdsForField = (orders: any[], fieldKey: OrderFieldKey) => {
  let ids: (string | undefined)[] = [];
  switch (fieldKey) {
    case OrderFieldKeys.drinkType:
      ids = orders.map((o) => o.drinkTypeName);
      break;
    case OrderFieldKeys.drinkSubtype:
      ids = orders.map((o) => o.drinkSubtypeName);
      break;
    case OrderFieldKeys.drinkVolume:
      ids = orders.map((o) => o.volumeName);
      break;
    case OrderFieldKeys.containerType:
      ids = orders.map((o) => o.containerTypeName);
      break;
    default:
      ids = [];
  }
  // Filter out undefined/null/empty
  return new Set(ids.filter((id): id is string => !!id && typeof id === 'string'));
};
