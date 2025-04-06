import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { styles } from './BeverageTypePage.styles';
import { useEffect, useState } from 'react';

const BEVERAGE_TYPES = [
  { id: 'vino', name: 'Vino' },
  { id: 'licor', name: 'Licor' },
  { id: 'cava', name: 'Cava' },
  { id: 'zumo', name: 'Zumo' },
  { id: 'cerveza', name: 'Cerveza' },
  { id: 'agua', name: 'Agua' },
  { id: 'refresco', name: 'Refresco' },
] as const;

export const BeverageTypePage = () => {
  const { orders } = useOrders();
  const { setIsNextDisabled } = usePagination();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const {} = usePagination();

  const numSelected = Object.values(orders).filter((order) => !!order.beverageType).length;

  useEffect(() => {
    setIsNextDisabled(numSelected === 0);
  }, [numSelected, setIsNextDisabled]);

  return (
    <div css={styles}>
      <h2>Select drink type:</h2>
      <div className="selected-pads">Selected pads: {Object.keys(orders).join(', ')}</div>

      <div className="beverage-grid">
        {BEVERAGE_TYPES.map(({ id, name }) => (
          <div
            key={id}
            className={`beverage-type ${id} ${selectedType === id ? 'selected' : ''}`}
            onClick={() => setSelectedType(id)}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};
