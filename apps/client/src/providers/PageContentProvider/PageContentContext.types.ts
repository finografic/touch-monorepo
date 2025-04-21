import type { ReactNode } from 'react';
import type { PageContentKeys } from './PageContentContext';
import { DISPLAY_NAME } from './PageContentContext';

export interface PageContentValues {
  [PageContentKeys.title]: string;
  [PageContentKeys.isDevDialogOpen]: boolean;
}

type PageContentSetters = {
  [K in keyof PageContentValues as PageContentValues[K] extends boolean
    ? `set${Capitalize<string & K>}`
    : `set${typeof DISPLAY_NAME}${Capitalize<string & K>}`]: (val: PageContentValues[K]) => void;
};

type PageContentActions = PageContentSetters & {
  setIsDevDialogOpen: (value: boolean) => void;
};

export interface PageContentProviderProps {
  initialValue?: PageContentStore;
  children: ReactNode;
}

export interface PageContentStore extends PageContentValues {
  actions: PageContentActions;
}
