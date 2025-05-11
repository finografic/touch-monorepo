import type { PadsConfig, PadUI } from 'types/ui.types';
import type { DataEntry } from 'types/data.types';
import type { OrderFieldKey } from 'types/orders.types';

// -------------------------------------------------------------------------- //
// NOTE: Initialize an array of pad items with default values

export const initAllPadUI = <T extends DataEntry>({
  data = [],
  config,
  fieldKey,
}: {
  data: T[];
  config: PadsConfig<T>;
  fieldKey: OrderFieldKey;
}): PadUI[] => {
  const labelKey = (config.labelKey as keyof T) || ('displayName' as keyof T);
  const maxPads = config.maxPads ?? data.length;
  const numPads = Math.min(data.length, maxPads);
  const slicedData = data.slice(0, numPads);
  const valueKeys = config.valueKeys;
  const type = config.type;
  const initChecked = config.initChecked ?? (() => false);

  return slicedData.map((item, i) => {
    const value: PadUI['value'] = {
      name: item.name,
      ...(valueKeys ? Object.fromEntries(valueKeys.map((key) => [key, item[key]])) : {}),
    };

    const pad: PadUI = {
      index: i,
      id: String(item?.name ?? item?.id ?? ''),
      label: String(item[labelKey] ?? ''),
      name: fieldKey,
      type,
      isChecked: false,
      value,
      metadata: item,
    };
    pad.isChecked = initChecked(pad);

    return pad;
  });
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
  const pads = initAllPadUI({ data, config, fieldKey });
  return { pads, numPads: pads.length };
};
