import type { PadConfig, PadUI } from 'types/ui.types';
import type { DataEntry } from 'types/data.types';
import type { OrderFieldKey } from 'types/orders.types';
import { OrderFieldKeys } from 'constants/app.config';

// -------------------------------------------------------------------------- //
// NOTE: Parse loader data and config to initialize pad items

export const parsePadConfig = <T extends DataEntry>({
  data = [],
  config,
  fieldKey,
}: {
  data: T[];
  config: PadConfig<T>;
  fieldKey: OrderFieldKey;
}): { pads: PadUI[]; numPads: number } => {
  const labelKey = (config.labelKey as keyof T) || ('displayName' as keyof T); // NOTE: which key to use for label
  const numPads = Math.min(data.length, config.maxPads);
  const slicedData = data.slice(0, numPads);

  const pads =
    numPads > 0
      ? Array.from({ length: numPads }, (_, i) => {
          const id = slicedData.map((item) => String(item.id ?? ''))[i] ?? '';
          // const name = slicedData.map((item) => String(item.name ?? ''))[i] ?? '';
          const label = labelKey ? slicedData.map((item) => String(item[labelKey] ?? ''))[i] : '';
          const initChecked = config.initChecked ?? (() => false);
          const value: { [key: string]: string | number | boolean } = {};

          for (const valueKey of config.valueKeys) {
            const rawValue = slicedData[i][valueKey];
            // Coerce the value to the expected type
            if (
              typeof rawValue === 'string' ||
              typeof rawValue === 'number' ||
              typeof rawValue === 'boolean'
            ) {
              value[valueKey as string] = rawValue;
            } else if (rawValue === undefined || rawValue === null) {
              value[valueKey as string] = '';
            } else {
              // For complex objects/arrays, convert to string
              value[valueKey as string] = String(rawValue);
            }
          }

          const pad: PadUI = {
            index: i,
            id,
            value,
            // key: id,
            label,
            name: fieldKey,
            type: config.type,
            isChecked: false,
            metadata: slicedData[i],
          };
          pad.isChecked = initChecked(pad as PadUI);

          return pad;
        })
      : [];

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
