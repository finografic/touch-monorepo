import type { ReactNode } from 'react';

import type { CreateSettersType } from '@finografic/zustand-context-creator';
import type { ContentKeys } from './ContentContext';

export interface ContentValues {
  [ContentKeys.title]: string;
}

const SETTER_PREFIX = 'Content';
type ContentSetters = CreateSettersType<ContentValues, typeof SETTER_PREFIX>;

export type ContentActions = ContentSetters;

export interface ContentStore extends ContentValues {
  actions: ContentActions;
}

export interface ContentProviderProps {
  initialValue?: Partial<ContentValues>;
  children: ReactNode;
}
