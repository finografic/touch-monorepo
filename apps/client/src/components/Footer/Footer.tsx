import { useLocation, useNavigate } from 'react-router-dom';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { styles } from './Footer.styles';
import { useOrders } from 'providers/OrdersProvider';
import { ROUTES, ROUTE_CONFIG } from 'routes/routes.config';

const PATHNAMES = Object.values(ROUTE_CONFIG).map((route) => route.pathname);

export const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { current, total, setPageCurrent, isNextDisabled } = usePagination();
  const { selectAllPads } = useOrders();

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

  return (
    <footer css={styles}>
      <div className="controls">
        {location.pathname === ROUTES.HOME && (
          <button className="control-btn" onClick={selectAllPads}>
            ALL
          </button>
        )}
        {current > 0 && (
          <button className="control-btn" onClick={handleBack}>
            « Back
          </button>
        )}
        {current < total && (
          <button className="control-btn" onClick={handleNext} disabled={isNextDisabled}>
            Next »
          </button>
        )}
      </div>
    </footer>
  );
};
