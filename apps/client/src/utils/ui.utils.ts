import type { PadConfig, PadUI } from 'types/pads.types';
import type { DataEntry } from 'types/data.types';
import type { FilterKey } from 'types/orders.types';
import { ROUTE_FILTER_KEYS } from 'config/app';

// -------------------------------------------------------------------------- //
// NOTE: Parse loader data and config to initialize pad items

export const parsePadConfig = <T extends DataEntry>({
  data = [],
  config,
  filterKey,
}: {
  data: T[];
  config: PadConfig<T>;
  filterKey: FilterKey;
}): { pads: PadUI[]; numPads: number } => {
  const labelKey = (config.labelKey as keyof T) || ('name' as keyof T); // NOTE: which key to use for label
  const numPads = Math.min(data.length, config.maxPads);
  const slicedData = data.slice(0, numPads);

  const pads =
    numPads > 0
      ? Array.from({ length: numPads }, (_, i) => {
          const currentItem = slicedData[i];
          const id = String(currentItem?.id ?? '');
          const label = labelKey ? String(currentItem?.[labelKey] ?? '') : '';
          const initChecked = config.initChecked ?? (() => false);
          const value: { [key: string]: string | number | boolean } = {};

          for (const key of config.valueKeys) {
            const valueKey = key as keyof typeof value;
            // Special handling for temperatureProfileId
            if (valueKey === 'temperatureProfileId') {
              const profileId = currentItem?.temperatureProfileId;
              if (profileId === undefined || profileId === null) {
                if (
                  filterKey === ROUTE_FILTER_KEYS.drinkType ||
                  filterKey === ROUTE_FILTER_KEYS.drinkSubtype
                ) {
                  // For now, we'll use a placeholder. This should be populated from the database
                  value[valueKey] = 'temp_+30.0'; // TODO: Replace with actual temperature profile lookup
                } else {
                  value[valueKey] = '';
                }
              } else {
                value[valueKey] = String(profileId);
              }
              continue;
            }

            // Handle other standard fields
            const rawValue = currentItem?.[valueKey as keyof typeof currentItem];

            // Regular value handling for other fields
            if (
              typeof rawValue === 'string' ||
              typeof rawValue === 'number' ||
              typeof rawValue === 'boolean'
            ) {
              value[valueKey] = rawValue;
            } else if (rawValue === undefined || rawValue === null) {
              // For non-temperature fields, empty string is fine as a default
              value[valueKey] = '';
            } else {
              // For complex objects/arrays, convert to string
              value[valueKey] = String(rawValue);
            }
          }

          const pad: PadUI = {
            index: i,
            id,
            value,
            label,
            name: filterKey,
            type: config.type,
            isChecked: false,
            filterApiKey: config.filterApiKey,
            metadata: currentItem,
          };
          pad.isChecked = initChecked(pad as PadUI);

          return pad;
        })
      : [];

  return { pads, numPads };
};

// -------------------------------------------------------------------------- //
// NOTE: Update pad state

export const getPadIdsForField = (orders: any[], filterKey: FilterKey) => {
  let ids: (string | undefined)[] = [];
  switch (filterKey) {
    case ROUTE_FILTER_KEYS.drinkType:
      ids = orders.map((o) => o.drinkTypeName);
      break;
    case ROUTE_FILTER_KEYS.drinkSubtype:
      ids = orders.map((o) => o.drinkSubtypeName);
      break;
    case ROUTE_FILTER_KEYS.drinkVolume:
      ids = orders.map((o) => o.volumeName);
      break;
    case ROUTE_FILTER_KEYS.containerType:
      ids = orders.map((o) => o.containerTypeName);
      break;
    default:
      ids = [];
  }
  // Filter out undefined/null/empty
  return new Set(ids.filter((id): id is string => !!id && typeof id === 'string'));
};
