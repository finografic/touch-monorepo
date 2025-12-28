import type { ComponentType } from 'react';

export interface NavItem {
  id: string;
  path: string;
  label: string;
  icon?: ComponentType<any> | undefined;
  children?: NavItem[]; // Sub-items for dropdown navigation
}
