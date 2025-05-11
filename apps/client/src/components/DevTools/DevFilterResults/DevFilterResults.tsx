import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider';
import { useLocation } from 'react-router-dom';
import { stylesLeft, stylesRight } from './DevFilterResults.styles';
import { useEffect, useMemo, useState } from 'react';
import type { DataEntry } from 'types/data.types';
import type { ApiResponse } from '@workspace/shared/types/api.types';
import { api } from 'api';

export const DevFilterResults = () => {
  const location = useLocation();
  const { fieldKey } = useRouteConfig();
  const { orders } = useOrders();

  const [data, setData] = useState<DataEntry[]>([]);

  const filters = useMemo(() => {
    const filters = orders[0]?.filters;
    if (filters) {
      return { ...filters };
    }
    return { hasSubtypes: false, drinkTypeId: '' };
  }, [orders]);

  useEffect(() => {
    const results = await api.get<ApiResponse<DataEntry[]>>('/orders');
    setData(results);
  }, [filters]);

  return (
    <>
      <aside id="dev-filter-results" css={stylesLeft}>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </aside>
    </>
  );
};
