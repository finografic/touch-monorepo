import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { ContentStore, ContentValues } from './ContentContext.types';
import { subscribeWithSelector } from 'zustand/middleware';
import { useTranslation } from 'react-i18next';

export const DISPLAY_NAME = 'Content';
export const SETTER_PREFIX = DISPLAY_NAME;

export enum ContentKeys {
  title = 'title',
  currentLanguage = 'currentLanguage',
}

export const defaultValue: ContentValues = {
  title: '',
  currentLanguage: 'en',
};

export const ContentContext = createZustandContext(({ initialValue }) => {
  return createStore<ContentStore>()(
    subscribeWithSelector(
      (set, get): ContentStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          changeLanguage: (languageCode: string) => {
            // Map flag codes to i18n language codes if needed
            const i18nCode = languageCode.includes('-') ? languageCode.split('-')[0] : languageCode;

            // Update the store
            set({ currentLanguage: i18nCode });

            // Update i18n - we'll need to access i18n instance
            // This will be handled by the component that calls changeLanguage
          },
        },
      }),
    ),
  );
});

type ContentReturn = Omit<ContentStore, 'actions'> & ContentStore['actions'];

export const useContent = (): ContentReturn => {
  const store = ContentContext.useContext();
  if (!store) {
    throw new Error(`use${SETTER_PREFIX} must be used within a ${DISPLAY_NAME}Provider`);
  }

  store.subscribe((_state, _prev) => {
    // store change
  });

  return useStore<StoreApi<ContentStore>, ContentReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
