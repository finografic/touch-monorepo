import type { CSSProperties } from 'react';
import type { ColumnKey } from './TranslationsTable';

export type TranslationsTableColumnBodyType =
  | 'index'
  | 'mode'
  | 'drinkType'
  | 'drinkSubtype'
  | 'volume'
  | 'containerType'
  | 'temperature'
  | 'actions';

export interface TranslationsTableColumnConfig {
  field: ColumnKey;
  header: string;
  sortable?: boolean;
  filter?: boolean;
  filterPlaceholder?: string;
  style?: CSSProperties;
  headerStyle?: CSSProperties;
  bodyType: TranslationsTableColumnBodyType;
}
