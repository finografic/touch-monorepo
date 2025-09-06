import { createStore, type StoreApi, useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { ContentStore, ContentValues } from './ContentContext.types';
import { subscribeWithSelector } from 'zustand/middleware';

export const DISPLAY_NAME = 'Content';
export const SETTER_PREFIX = DISPLAY_NAME;

export enum ContentKeys {
  title = 'title',
  currentLanguage = 'currentLanguage',
  theme = 'theme',
}

export const defaultValue: ContentValues = {
  title: '',
  currentLanguage: 'es-ES', // ✅ Use full locale code as the default
  theme: 'dark', // ✅ Default theme
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
          setTheme: (theme: 'light' | 'dark') => {
            set({ theme });
            // Update document attribute for CSS variable targeting
            document.documentElement.setAttribute('data-theme', theme);
            // Persist to localStorage
            localStorage.setItem('touch-app-theme', theme);
          },
          toggleTheme: () => {
            set((state) => {
              const newTheme = state.theme === 'light' ? 'dark' : 'light';
              // Update document attribute for CSS variable targeting
              document.documentElement.setAttribute('data-theme', newTheme);
              // Persist to localStorage
              localStorage.setItem('touch-app-theme', newTheme);
              return { theme: newTheme };
            });
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

  return useStore<StoreApi<ContentStore>, ContentReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
