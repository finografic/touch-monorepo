import type { ReactNode } from 'react';
import { PageContentKeys } from './PageContentContext';

export type PageContentValues = {
  [PageContentKeys.title]: string;
};

type PageContentSetters = {
  [K in keyof PageContentValues as `setPageContent${Capitalize<string & K>}`]: (
    val: PageContentValues[K],
  ) => void;
};

type PageContentActions = PageContentSetters & {};

export type PageContentProviderProps = {
  initialValue?: PageContentStore;
  children: ReactNode;
};

export interface PageContentStore extends PageContentValues {
  actions: PageContentActions;
}
