import { useLocation, useNavigate } from 'react-router-dom';
import { ButtonControl } from 'components/ButtonControl/ButtonControl';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { ROUTE_CONFIG, ROUTES } from 'routes/routes.config';
import { MockOrdersButton } from './DevMockOrders/MockOrdersButton';
import { styles } from './Footer.styles';

const PATHNAMES = Object.values(ROUTE_CONFIG).map((route) => route.pathname);

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { current, total, setPageCurrent, isNextDisabled } = usePagination();
  const { selectAllPads, orders, setOrders } = useOrders();

  const handleBack = () => {
    if (current > 0) {
      const newIndex = current - 1;
      const nextPathname = PATHNAMES[newIndex];
      setPageCurrent(newIndex);
      navigate(nextPathname, { replace: true });
    }
  };

  const handleNext = () => {
    const newIndex = current + 1;
    const nextPathname = PATHNAMES[newIndex];
    setPageCurrent(newIndex);
    if (nextPathname) {
      navigate(nextPathname, { replace: true });
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
      navigate(nextPathname, { replace: true });
    }
  };

  return (
    <footer css={styles}>
      <div className="controls">
        {location.pathname === ROUTES.HOME && <MockOrdersButton />}
        {location.pathname === ROUTES.HOME && (
          <ButtonControl className="btn-control" onClick={selectAllPads}>
            ALL
          </ButtonControl>
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
}
