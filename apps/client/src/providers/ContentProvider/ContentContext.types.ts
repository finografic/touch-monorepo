import type { ReactNode } from 'react';
import type { ContentKeys, SETTER_PREFIX } from './ContentContext';
import type { CreateSettersType } from 'utils/zustand';

export interface ContentValues {
  [ContentKeys.title]: string;
  [ContentKeys.currentLanguage]: string;
  [ContentKeys.theme]: 'light' | 'dark';
}

type ContentSetters = CreateSettersType<ContentValues, typeof SETTER_PREFIX> & {
  setCurrentLanguage: (languageCode: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
};

type ContentActions = ContentSetters & {};

export interface ContentProviderProps {
  initialValue?: Partial<ContentStore>;
  children: ReactNode;
}

export interface ContentStore extends ContentValues {
  actions: ContentActions;
}
