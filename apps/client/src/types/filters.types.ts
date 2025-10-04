import type { FilterKeys } from 'config/app';
import type { DrinkSubtype, DrinkType } from 'types/models/drink-type.model';
import type { ContainerType, FilterFieldKey, Temperature, Volume } from 'types/orders.types';
import type { TemperatureFilter } from 'types/temperature.types';

/**
 * Type representing valid filter keys derived from FilterKeys constant
 */
export type FilterKey = keyof typeof FilterKeys;

// Base interface for all filters
interface BaseFilter {
  id: string;
  name: string;
}

// Specific filter types with lookup information
interface ModeFilter extends BaseFilter {}

interface DrinkTypeFilter extends BaseFilter {
  hasSubtypes: boolean;
  defaultTempConsume?: number;
  defaultTempFreeze?: number;
  lookup?: { [FilterKeys.drinkTypeName]: string };
}

interface DrinkSubtypeFilter extends BaseFilter {
  defaultTempConsume?: number;
  defaultTempFreeze?: number;
  lookup?: { [FilterKeys.drinkSubtypeName]: string };
}

interface VolumeFilter extends BaseFilter {
  lookup?: { [FilterKeys.volumeName]: string };
}

interface ContainerTypeFilter extends BaseFilter {
  lookup?: { [FilterKeys.containerTypeName]: string };
}
// Type for individual filter values
export interface OrderFilter {
  value: DrinkType | DrinkSubtype | Volume | ContainerType | Temperature;
  hasSubtypes?: boolean;
}

// The fields that are managed by the selection process
export interface OrderFilters extends Partial<Record<FilterFieldKey, unknown>> {
  mode?: ModeFilter;
  drinkType?: DrinkTypeFilter;
  drinkSubtype?: DrinkSubtypeFilter;
  drinkVolume?: VolumeFilter;
  containerType?: ContainerTypeFilter;
  temperature?: TemperatureFilter;
}
