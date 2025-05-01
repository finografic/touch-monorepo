import type { LayoutUiValues } from './LayoutUiContext.types';
import { DISPLAY_NAME, LayoutUiContext as LayoutUi } from './LayoutUiContext';
import type { ReactNode } from 'react';

export const LayoutUiProvider = ({
  initialValue,
  children,
}: {
  initialValue: LayoutUiValues;
  children: ReactNode;
}) => {
  return <LayoutUi.Provider initialValue={initialValue}>{children}</LayoutUi.Provider>;
};

LayoutUiProvider.displayName = `${DISPLAY_NAME}Provider`;
