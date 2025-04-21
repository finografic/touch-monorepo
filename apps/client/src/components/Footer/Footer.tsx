import { useLocation, useNavigate } from 'react-router-dom';
import { ButtonControl } from 'components/ButtonControl/ButtonControl';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { ROUTE_CONFIG, ROUTES } from 'routes/routes.config';
import { MockOrdersButton } from './DevMockOrders/MockOrdersButton';
import { styles } from './Footer.styles';
import { useTemperatureCalculation } from 'hooks/useTemperatureCalculation';
import { usePageContent } from 'providers/PageContentProvider/PageContentContext';
import { useEffect } from 'react';

export const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { setIsDevDialogOpen } = usePageContent();
  const { current, setPageCurrent, isNextDisabled } = usePagination();
  const { selectAllPads, orders, setOrders } = useOrders();

  // ------------------------------------------------------------------------ //

  const hasDrinkSubtypes = orders.some((order) => order?.drinkType?.hasSubtypes);
  const shouldFetchDrinkSubtypes = location.pathname === ROUTES.DRINK_TYPE && hasDrinkSubtypes;

  const pathnames = hasDrinkSubtypes
    ? Object.values(ROUTE_CONFIG).map((route) => route.pathname)
    : Object.values(ROUTE_CONFIG)
        .map((route) => route.pathname)
        .filter((pathname) => pathname !== ROUTES.DRINK_SUBTYPE);

  // ------------------------------------------------------------------------ //

  useEffect(() => {
    if (orders.length === 0 && location.pathname !== ROUTES.HOME) {
      navigate(ROUTES.HOME);
    }
  }, [orders, location.pathname, navigate]);

  // ------------------------------------------------------------------------ //

  const { calculateForOrder, isPending: isCalculating } = useTemperatureCalculation({
    onSuccess: (data) => {
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
      navigate(pathnames[0], { replace: true });
    },
    onError: (error) => {
      // TODO: Show error message to user
      console.error('Failed to calculate temperature:', error);
    },
  });

  const handleBack = () => {
    // if (location.pathname === ROUTES.DRINK_SUBTYPE && hasDrinkSubtypes) {
    //   navigate(ROUTES.DRINK_TYPE, { replace: true });
    //   return;
    // }
    // if (location.pathname === ROUTES.DRINK_VOLUME && hasDrinkSubtypes) {
    //   navigate(ROUTES.DRINK_SUBTYPE, { replace: true });
    //   return;
    // }
    if (current > 0) {
      const newIndex = current - 1;
      const nextPathname = pathnames[newIndex];
      setPageCurrent(newIndex);
      navigate(nextPathname, { replace: true });
    }
  };

  const handleNext = () => {
    // log('(FOOTER) handleNext', 'grey', { pathname: location.pathname, hasDrinkSubtypes });
    // if (location.pathname === ROUTES.DRINK_TYPE && hasDrinkSubtypes) {
    //   navigate(ROUTES.DRINK_SUBTYPE, { replace: true });
    //   return;
    // }
    const newIndex = current + 1;
    const nextPathname = pathnames[newIndex];
    setPageCurrent(newIndex);
    if (nextPathname) {
      navigate(nextPathname, { replace: true });
    }
  };

  const handleStart = () => {
    // Get the first selected order and calculate its temperature
    const selectedOrder = orders.find((order) => order.isSelected);
    if (selectedOrder) {
      calculateForOrder(selectedOrder);
    }
  };

  const isVisibleBackButton = current > 0;
  const isVisibleNextButton = location.pathname !== ROUTES.FINAL_TEMPERATURE;
  // const isVisibleNextButton = current < total;

  return (
    <footer css={styles}>
      <div className="controls">
        <ButtonControl className="btn-control" onClick={() => setIsDevDialogOpen(true)}>
          DATA
        </ButtonControl>
        {location.pathname === ROUTES.HOME && <MockOrdersButton />}
        {location.pathname === ROUTES.HOME && (
          <ButtonControl className="btn-control" onClick={selectAllPads}>
            ALL
          </ButtonControl>
        )}
        {isVisibleBackButton && (
          <ButtonControl className="btn-control" onClick={handleBack}>
            « Back
          </ButtonControl>
        )}
        {isVisibleNextButton && (
          <ButtonControl className="btn-control" onClick={handleNext} disabled={isNextDisabled}>
            Next »
          </ButtonControl>
        )}
        {location.pathname === ROUTES.FINAL_TEMPERATURE && (
          <ButtonControl
            className="btn-control btn-start"
            onClick={handleStart}
            disabled={isNextDisabled || isCalculating}
          >
            {isCalculating ? 'Calculating...' : 'START'}
          </ButtonControl>
        )}
      </div>
    </footer>
  );
};
