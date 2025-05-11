import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider';
import { useLocation } from 'react-router-dom';
import { styles } from './DevFilterResults.styles';
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
      return [...Object.entries(filters)];
    }
    return [];
  }, [orders]);

  useEffect(() => {
    const results = await api.get<ApiResponse<DataEntry[]>>('/orders');
    setData(results);
  }, [filters]);

  return (
    <>
      <div id="dev-filter-results" css={styles}>
        <pre>
          <h4>FILTERS:{Number(filters?.length)}</h4>
        </pre>
        <pre>
          <h4>RESULTS:{Number(data?.length)}</h4>
        </pre>
        <pre>
          {data.map((entry) => (
            <div>{JSON.stringify(entry)}</div>
          ))}
        </pre>
      </div>
    </>
  );
};
