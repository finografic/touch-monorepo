import type { RegionLocale } from '@workspace/i18n';

import type { DataEntry } from 'types/data.types';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { FilterKey } from 'types/slots.types';
import type { PadConfig } from 'types/pads.types';

/**
 * Parameters for handleRouteChange method
 */
export interface HandleRouteChangeParams {
  /** Current filter key (route step) */
  filterKey: FilterKey | undefined;
  /** Loader data for the current route */
  loaderData: DataEntry[];
  /** Pad configuration for the current route */
  padsConfig: PadConfig;
  /** Data pool for UI button options */
  dataPool: DataEntry[] | OrderReadableModel[];
  /** Server field mapping for filter synchronization */
  serverFieldMap: Record<string, string>;
  /** Current language locale */
  currentLanguage?: RegionLocale;
}
