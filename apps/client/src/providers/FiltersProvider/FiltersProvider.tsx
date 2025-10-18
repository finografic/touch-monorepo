import { DISPLAY_NAME, FiltersContext as Filters } from './FiltersContext';
import type { FiltersProviderProps } from './FiltersContext.types';

export const FiltersProvider = ({ initialValue, children }: FiltersProviderProps) => {
  return <Filters.Provider initialValue={initialValue}>{children}</Filters.Provider>;
};

FiltersProvider.displayName = `${DISPLAY_NAME}Provider`;
