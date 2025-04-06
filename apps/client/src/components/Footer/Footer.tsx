import { useNavigate } from 'react-router-dom';
import { usePagination } from '../../providers/PaginationProvider/PaginationContext';
import { styles } from './Footer.styles';
import { useOrders } from '../../providers/OrdersProvider';
export const Footer = () => {
  const navigate = useNavigate();
  const { current, total, setPageCurrent } = usePagination();
  const { activePads } = useOrders();

  const handleSelectAll = () => {};

  const handleBack = () => {
    if (current > 0) {
      setPageCurrent(current - 1);
      navigate(-1);
    }
  };

  const handleNext = () => {
    setPageCurrent(current + 1);
    navigate('/beverage-type');
  };

  return (
    <footer css={styles}>
      <div className="controls">
        {current === 0 && (
          <button className="control-btn" onClick={handleSelectAll}>
            ALL
          </button>
        )}
        {current > 0 && (
          <button className="control-btn" onClick={handleBack}>
            « Back
          </button>
        )}
        {current < total && (
          <button
            className="control-btn"
            onClick={handleNext}
            disabled={!Object.values(activePads).some((isActive) => isActive)}
          >
            Next »
          </button>
        )}
      </div>
    </footer>
  );
};
