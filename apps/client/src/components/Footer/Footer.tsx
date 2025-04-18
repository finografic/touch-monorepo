import { useLocation, useNavigate } from 'react-router-dom';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { styles } from './Footer.styles';
import { useOrders } from 'providers/OrdersProvider';
import { ROUTES, ROUTE_CONFIG } from 'routes/routes.config';
import { MockOrdersButton } from './DevMockOrders/MockOrdersButton';
import { ButtonControl } from 'components/ButtonControl/ButtonControl';

const PATHNAMES = Object.values(ROUTE_CONFIG).map((route) => route.pathname);

export const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { current, total, setPageCurrent, isNextDisabled } = usePagination();
  const { selectAllPads, orders, setOrders } = useOrders();

  const handleBack = () => {
    if (current > 0) {
      setPageCurrent(current - 1);
      navigate(-1);
    }
  };

  const handleNext = () => {
    setPageCurrent(current + 1);
    const nextPathname = PATHNAMES[current + 1];
    if (nextPathname) {
      navigate(nextPathname);
    }
  };

  const handleStart = () => {
    // Update processStatus for all selected orders
    const updatedOrders = orders.map((order) => ({
      ...order,
      processStatus: order.isSelected
        ? {
            isProcessing: true,
            timeRemaining: 60, // Mock value: 60 seconds
          }
        : order.processStatus,
    }));
    setOrders(updatedOrders);

    // Navigate back to first page
    setPageCurrent(0);
    const nextPathname = PATHNAMES[0];
    if (nextPathname) {
      navigate(nextPathname);
    }
  };

  return (
    <footer css={styles}>
      <div className="controls">
        {location.pathname === ROUTES.HOME && <MockOrdersButton />}
        {location.pathname === ROUTES.HOME && (
          <button className="btn-control" onClick={selectAllPads}>
            ALL
          </button>
        )}
        {current > 0 && (
          <ButtonControl className="btn-control" onClick={handleBack}>
            « Back
          </ButtonControl>
        )}
        {current < total && (
          <ButtonControl className="btn-control" onClick={handleNext} disabled={isNextDisabled}>
            Next »
          </ButtonControl>
        )}
        {location.pathname === ROUTES.FINAL_TEMPERATURE && (
          <ButtonControl className="btn-control btn-start" onClick={handleStart} disabled={isNextDisabled}>
            START
          </ButtonControl>
        )}
      </div>
    </footer>
  );
};
