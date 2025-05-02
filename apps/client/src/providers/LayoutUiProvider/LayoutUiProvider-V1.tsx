import { useEffect } from 'react';
import type { LayoutUiProviderProps, LayoutUiValues } from './LayoutUiContext.types';
import { DISPLAY_NAME, LayoutUiContext as LayoutUi } from './LayoutUiContext';

// Observer pattern approach
const useLayoutUiObserver = (callback: (state: LayoutUiValues) => void) => {
  const store = LayoutUi.useContext();
  if (!store) return;

  useEffect(() => {
    return store.subscribe((state) => {
      callback(state);
    });
  }, [store, callback]);
};

export const LayoutUiProvider = ({ initialValue, children }: LayoutUiProviderProps) => {
  const store = LayoutUi.useContext();

  // Approach 1: Direct store subscription
  useEffect(() => {
    if (!store) return;

    console.log('🔄 1. FieldKey changing..');

    const unsubscribe = store.subscribe((state, prevState) => {
      console.log('🔄 2. FieldKey changed !!', state, prevState);

      // Only react to fieldKey changes
      if (state.fieldKey !== prevState.fieldKey) {
        console.log('🔄 3. FieldKey changed:', { new: state.fieldKey, prev: prevState.fieldKey });
        // Here you could trigger any necessary updates
      }
    });

    return unsubscribe;
  }, [store]);

  /* Approach 2: Using the observer pattern
  useLayoutUiObserver((state) => {
    console.log('🔍 Layout UI State changed:', state);
    // Here you could handle any state changes
  });
  */

  return <LayoutUi.Provider initialValue={initialValue}>{children}</LayoutUi.Provider>;
};

LayoutUiProvider.displayName = `${DISPLAY_NAME}Provider`;
