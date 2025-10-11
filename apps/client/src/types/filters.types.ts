import type { API_FILTER_FIELDS } from 'config/app';
import type { DrinkSubtype, DrinkType } from 'types/models/drink-type.model';
import type { ContainerType, FilterFieldKey, Temperature, Volume } from 'types/orders.types';
import type { TemperatureFilter } from 'types/temperature.types';

/**
 * Type representing valid filter keys derived from API_FILTER_FIELDS constant
 */
export type FilterZZZKey = keyof typeof API_FILTER_FIELDS;

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
}

interface DrinkSubtypeFilter extends BaseFilter {
  defaultTempConsume?: number;
  defaultTempFreeze?: number;
}

interface VolumeFilter extends BaseFilter {}

interface ContainerTypeFilter extends BaseFilter {}
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
