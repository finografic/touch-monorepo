import type { LayoutUiProviderProps } from './LayoutUiContext.types';
import { DISPLAY_NAME, LayoutUiContext as LayoutUi } from './LayoutUiContext';
import { LayoutUiObserver } from './LayoutUiObserver';

export const LayoutUiProvider = ({ initialValue, children }: LayoutUiProviderProps) => {
  return (
    <LayoutUi.Provider initialValue={initialValue}>
      {children}
      <LayoutUiObserver />
    </LayoutUi.Provider>
  );
};

LayoutUiProvider.displayName = `${DISPLAY_NAME}Provider`;
