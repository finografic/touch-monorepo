import type {
  TemperatureTableEntity,
  TemperatureTableEntryEntity,
} from '@touch/server/types/entities/temperature.entity';
import type { ConvertKeysToCamelCase, OverridePropTypes } from 'types/utility.types';
import type { ModelBaseProps } from 'types/base.types';

export type TemperatureTable = OverridePropTypes<
  TemperatureTableCamelCase,
  ModelBaseProps & {
    elementType: 1 | 2 | 3; // Strongly typed element types
    entries?: TemperatureTableEntry[]; // Optional relationship
  }
>;

export type TemperatureTableEntry = OverridePropTypes<
  TemperatureTableEntryCamelCase,
  ModelBaseProps & {
    temperature: number; // Already number in DB
    timeMinutes: number; // Already number in DB
  }
>;

type TemperatureTableCamelCase = ConvertKeysToCamelCase<TemperatureTableEntity>;
type TemperatureTableEntryCamelCase = ConvertKeysToCamelCase<TemperatureTableEntryEntity>;
