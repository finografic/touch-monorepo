import type { ReactNode } from 'react';
import type { ContentKeys, SETTER_PREFIX } from './ContentContext';

export interface ContentValues {
  [ContentKeys.title]: string;
}

type ContentSetters = {
  [K in keyof ContentValues as ContentValues[K] extends boolean
    ? `set${Capitalize<string & K>}`
    : `set${typeof SETTER_PREFIX}${Capitalize<string & K>}`]: (val: ContentValues[K]) => void;
};

type ContentActions = ContentSetters & {};

export interface ContentProviderProps {
  initialValue?: ContentStore;
  children: ReactNode;
}

export interface ContentStore extends ContentValues {
  actions: ContentActions;
}
