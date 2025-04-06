import { useOrders } from '../../providers/OrdersProvider';
import { usePagination } from '../../providers/PaginationProvider/PaginationContext';
import { useNavigate } from 'react-router-dom';
import { styles } from './BeverageTypePage.styles';

export function BeverageTypePage() {
  const { orders } = useOrders();
  const { setPageCurrent } = usePagination();
  const navigate = useNavigate();

  const handleBack = () => {
    setPageCurrent(0);
    navigate('/');
  };

  return (
    <div css={styles}>
      <h2>Select Beverage Type</h2>
      <div className="selected-pads">Selected pads: {Object.keys(orders).join(', ')}</div>

      {/* We'll add the beverage type selection UI here */}

      <div className="controls">
        <button className="control-btn" onClick={handleBack}>
          « Back
        </button>
        <button className="control-btn">Next »</button>
      </div>
    </div>
  );
}
