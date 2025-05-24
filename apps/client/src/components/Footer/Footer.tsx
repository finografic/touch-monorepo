import { useLocation, useNavigate } from 'react-router-dom';
import { ButtonControl } from 'components/ButtonControl/ButtonControl';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { PATHS } from 'routes/routes.config';
import { MockOrdersButton } from '../DevTools/DevMockOrders/MockOrdersButton';
import { styles } from './Footer.styles';
import { useTemperatureCalculation } from 'hooks/useTemperatureCalculation';
import { useCallback, useEffect, useTransition } from 'react';
import { Col, Row } from 'react-grid-system';
import { useRoutePathnamesByFilters } from 'routes/hooks/useRoutePathnamesByFilters';

export const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { current, setPageCurrent, isNextDisabled } = usePagination();
  const { selectAllOrders, orders, setOrders } = useOrders();
  const { pathnames } = useRoutePathnamesByFilters();

  useEffect(() => {
    if (orders.length === 0 && location.pathname !== PATHS.home) {
      navigate(PATHS.home);
    }
  }, [orders, location.pathname, navigate]);

  const { calculateForOrder, isPending: isCalculating } = useTemperatureCalculation({
    onSuccess: (data) => {
      startTransition(() => {
        // Update processStatus for the order
        const updatedOrders = orders.map((order) => ({
          ...order,
          processStatus: order.isSelected
            ? {
                isProcessing: true,
                timeRemaining: data.estimatedDurationSeconds,
              }
            : order.processStatus,
        }));
        setOrders(updatedOrders);

        // Navigate back to first page
        setPageCurrent(0);
        navigate(pathnames[0]!, { replace: true });
      });
    },
    onError: (error) => {
      // TODO: Show error message to user
      console.error('Failed to calculate temperature:', error);
    },
  });

  const handleBack = useCallback(() => {
    if (current > 0) {
      startTransition(() => {
        const newIndex = current - 1;
        const nextPathname = pathnames[newIndex];
        setPageCurrent(newIndex);
        navigate(nextPathname, { replace: true });
      });
    }
  }, [current, navigate, pathnames, setPageCurrent]);

  const handleNext = useCallback(() => {
    const newIndex = current + 1;
    const nextPathname = pathnames[newIndex];

    startTransition(() => {
      setPageCurrent(newIndex);
      if (nextPathname) {
        navigate(nextPathname, { replace: true });
      }
    });
  }, [current, navigate, pathnames, setPageCurrent]);

  const handleStart = useCallback(() => {
    // Get the first selected order and calculate its temperature
    const selectedOrder = orders.find((order) => order.isSelected);
    if (selectedOrder) {
      calculateForOrder(selectedOrder);
    }
  }, [calculateForOrder, orders]);

  const isVisibleBackButton = current > 0;
  const isVisibleNextButton = location.pathname === PATHS.temperature;

  return (
    <footer css={styles}>
      <Row>
        <Col xs={12}>
          <div className="controls">
            {/* {location.pathname === PATHS.home && <MockOrdersButton />} */}
            <MockOrdersButton />
            {location.pathname === PATHS.home && (
              <ButtonControl className="btn-control" onClick={selectAllOrders}>
                ALL
              </ButtonControl>
            )}
            {isVisibleBackButton && (
              <ButtonControl className="btn-control" onClick={handleBack} disabled={isPending}>
                « Back
              </ButtonControl>
            )}
            {isVisibleNextButton && (
              <ButtonControl
                className="btn-control"
                onClick={handleNext}
                disabled={isNextDisabled || isPending}
              >
                Next »
              </ButtonControl>
            )}
            {location.pathname === PATHS.temperature && (
              <ButtonControl
                className="btn-control btn-start"
                onClick={handleStart}
                disabled={isNextDisabled || isCalculating || isPending}
              >
                {isCalculating ? 'Calculating...' : 'START'}
              </ButtonControl>
            )}
          </div>
        </Col>
      </Row>
    </footer>
  );
};
