import type { PadConfig, PadUI } from 'types/pads.types';
import type { DataEntry } from 'types/data.types';
import type { OrderFieldKey } from 'types/orders.types';
import { OrderFieldKeys } from 'constants/app.config';
import { getLocalizedName } from './localization.utils';
import type { RegionLocale } from '@workspace/core/types';

// -------------------------------------------------------------------------- //
// NOTE: Parse loader data and config to initialize pad items

export const parsePadConfig = <T extends DataEntry>({
  data = [],
  config,
  fieldKey,
  currentLanguage = 'es-ES',
}: {
  data: T[];
  config: PadConfig<T>;
  fieldKey: OrderFieldKey;
  currentLanguage?: RegionLocale;
}): { pads: PadUI[]; numPads: number } => {
  const labelKey = (config.labelKey as keyof T) || ('nameEs' as keyof T); // NOTE: which key to use for label
  const numPads = Math.min(data.length, config.maxPads);
  const slicedData = data.slice(0, numPads);

  const pads: PadUI[] = slicedData.map((item, index) => {
    const id = String(item.id);
    const name = fieldKey;
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
