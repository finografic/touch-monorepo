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

  log('__VALUE', 'blue', config);

  const pads =
    numPads > 0
      ? Array.from({ length: numPads }, (_, i) => {
          const id = slicedData.map((item) => String(item.id ?? ''))[i] ?? '';
          const name = slicedData.map((item) => String(item.name ?? ''))[i] ?? '';
          const label = labelKey ? slicedData.map((item) => String(item[labelKey] ?? ''))[i] : '';

          // const value = slicedData.map((item) => String(item.name ?? ''))[i];
          // const value = slicedData[i].map((item) => {
          //   return {
          //     nane: item.name ?? '',
          //   };
          // });

          // const value = config.valueKeys?.map((valueKey: string) => {
          //     return {
          //       name,
          //       id,
          //       ...OrderFieldKeys(valueKey === 'hasSubt')
          //       hasSubtypes: slicedData[i].hasSubtypes ?? false,
          //     };
          //   }) ?? {};

          // const value = {} as { [K in keyof T]: T[K] };
          const value = {} as any;

          // for (const valueKey of config.valueKeys as (keyof T)[]) {
          for (const valueKey of config.valueKeys as (keyof T)[]) {
            value[valueKey] = slicedData[i][valueKey] ?? '';
          }
          // const values =
          //   config.valueKeys?.map((valueKey: keyof T) => {
          //     return {
          //       [valueKey]: slicedData[i][valueKey] ?? '',
          //     };
          //   }) ?? {};

          // const value = Object.assign({}, ...config.valueKeys.map((valueKey: string) => {
          //   return {
          //     [valueKey]: slicedData[i][valueKey] ?? '',
          //   };
          // }));

          const initChecked = config.initChecked ?? (() => false);

          const pad: PadUI = {
            index: i,
            id,
            value,
            key: id,
            label,
            name: fieldKey,
            type: config.type,
            isChecked: false,
            metadata: slicedData[i],
          };
          pad.isChecked = initChecked(pad as PadUI);
          /*
          get isChecked(pad): boolean {
              return initChecked(pad);
            },
          };
          pad.isChecked = (): boolean => initChecked(pad as PadUI) as boolean;
          */
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
