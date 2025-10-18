import type { RegionLocale } from '@workspace/i18n';

import { ROUTE_FILTER_KEYS } from 'config/app';
import type { DataEntry } from 'types/data.types';
import type { FilterKey } from 'types/orders.types';
import type { PadConfig, PadUI } from 'types/pads.types';

import { getLocalizedName } from './i18n/localization.utils';

// -------------------------------------------------------------------------- //
// NOTE: Parse loader data and config to initialize pad items

export const parsePadConfig = <T extends DataEntry>({
  data = [],
  config,
  filterKey,
  currentLanguage = 'es-ES',
}: {
  data: T[];
  config: PadConfig<T>;
  filterKey: FilterKey;
  currentLanguage?: RegionLocale;
}): { pads: PadUI[]; numPads: number } => {
  const labelKey = (config.labelKey as keyof T) || ('nameEs' as keyof T); // NOTE: which key to use for label
  const numPads = Math.min(data.length, config.maxPads);
  const slicedData = data.slice(0, numPads);

  const pads: PadUI[] = slicedData.map((item, index) => {
    const id = String(item.id);
    const name = filterKey;
    const type = config.type;

    // Use localized name based on current language
    const label = getLocalizedName(item as any, currentLanguage);

    // Build value object from specified keys
    const value = config.valueKeys.reduce(
      (acc, key) => {
        acc[key as string] = item[key];
        return acc;
      },
      {} as Record<string, any>,
    );

    // Check if this pad should be initially checked
    const isChecked = config.initChecked
      ? config.initChecked({ id, label, name, value, index, type } as PadUI)
      : false;

    return {
      id,
      label,
      name,
      value,
      index,
      type,
      isChecked,
      metadata: item,
    };
  });

  return { pads, numPads };
};
