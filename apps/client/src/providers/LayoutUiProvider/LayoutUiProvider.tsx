import { DISPLAY_NAME, LayoutUiContext as LayoutUi } from './LayoutUiContext';
import type { LayoutUiProviderProps } from './LayoutUiContext.types';

export const LayoutUiProvider = ({ initialValue, children }: LayoutUiProviderProps) => {
  return <LayoutUi.Provider initialValue={initialValue}>{children}</LayoutUi.Provider>;
};

LayoutUiProvider.displayName = `${DISPLAY_NAME}Provider`;
