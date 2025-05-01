import type { ReactNode } from 'react';
import type { PageContentKeys, SETTER_PREFIX } from './PageContentContext';

export interface PageContentValues {
  [PageContentKeys.title]: string;
}

type PageContentSetters = {
  [K in keyof PageContentValues as PageContentValues[K] extends boolean
    ? `set${Capitalize<string & K>}`
    : `set${typeof SETTER_PREFIX}${Capitalize<string & K>}`]: (val: PageContentValues[K]) => void;
};

type PageContentActions = PageContentSetters & {};

export interface PageContentProviderProps {
  initialValue?: PageContentStore;
  children: ReactNode;
}

export interface PageContentStore extends PageContentValues {
  actions: PageContentActions;
}
