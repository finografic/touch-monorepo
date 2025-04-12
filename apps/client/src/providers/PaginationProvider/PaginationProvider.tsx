import { useEffect } from 'react';
import { useOrders } from '../OrdersProvider';
import type { PaginationProviderProps } from './Pagination.types';
import { PaginationContext as Pagination } from './PaginationContext';
import { DISPLAY_NAME } from './PaginationContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from 'routes/routes.config';

export const PaginationProvider = ({ initialValue, children }: PaginationProviderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useOrders();

  useEffect(() => {
    if (orders.length === 0 && location.pathname !== ROUTES.HOME) {
      navigate(ROUTES.HOME);
    }
  }, [orders]);

  return <Pagination.Provider initialValue={initialValue}>{children}</Pagination.Provider>;
};

PaginationProvider.displayName = `${DISPLAY_NAME}Provider`;
