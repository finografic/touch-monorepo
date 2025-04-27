import type { LayoutUiProviderProps } from './LayoutUiContext.types';
import { LayoutUiContext as LayoutUi } from './LayoutUiContext';
import { DISPLAY_NAME } from './LayoutUiContext';

export const LayoutUiProvider = ({ initialValue, children }: LayoutUiProviderProps) => {
  return <LayoutUi.Provider initialValue={initialValue}>{children}</LayoutUi.Provider>;
};

LayoutUiProvider.displayName = `${DISPLAY_NAME}Provider`;
