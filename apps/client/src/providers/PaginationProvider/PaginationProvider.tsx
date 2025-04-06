import type { PaginationProviderProps } from './Pagination.types';
import { PaginationContext as Pagination } from './PaginationContext';
import { DISPLAY_NAME } from './PaginationContext';

export const PaginationProvider = ({ initialValue, children }: PaginationProviderProps) => {
  return <Pagination.Provider initialValue={initialValue}>{children}</Pagination.Provider>;
};

PaginationProvider.displayName = `${DISPLAY_NAME}Provider`;
