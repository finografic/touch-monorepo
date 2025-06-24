import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { ContentStore, ContentValues } from './ContentContext.types';
import { subscribeWithSelector } from 'zustand/middleware';

export const DISPLAY_NAME = 'Content';
export const SETTER_PREFIX = DISPLAY_NAME;

export enum ContentKeys {
  title = 'title',
  currentLanguage = 'currentLanguage',
}

export const defaultValue: ContentValues = {
  title: '',
  currentLanguage: 'es-ES', // ✅ Use full locale code as the default
};

export const ContentContext = createZustandContext(({ initialValue }) => {
  return createStore<ContentStore>()(
    subscribeWithSelector(
      (set, _get): ContentStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          setCurrentLanguage: (languageCode: string) => {
            // Store the full locale code in ContentProvider (e.g., 'es-ES', 'en-GB')
            // This preserves regional information for currency, formatting, flags, etc.
            set({ currentLanguage: languageCode });

            // Note: i18n.changeLanguage() should be called separately by the component
            // to update i18next with the simple code (e.g., 'es', 'en')
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
