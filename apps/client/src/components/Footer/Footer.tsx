import { useLocation, useNavigate } from 'react-router-dom';
import { ButtonControl } from 'components/ButtonControl/ButtonControl';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { PATHS, type RoutePath, ROUTES_CONFIG } from 'routes/routes.config';
import { MockOrdersButton } from '../DevTools/DevMockOrders/MockOrdersButton';
import { styles } from './Footer.styles';
import { useTemperatureCalculation } from 'hooks/useTemperatureCalculation';
// import { useContent } from 'providers/ContentProvider/ContentContext';
import { useCallback, useEffect, useTransition } from 'react';
// import { useQueryClient } from '@tanstack/react-query';
// import { GET_TEMPERATURE_SETTINGS_QUERYKEY } from '../../queries/temperature';
import { useDev } from 'providers/DevProvider/DevContext';

export const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  // const queryClient = useQueryClient();
  // const isFetching = queryClient.isFetching() || queryClient.isMutating();

  const { setIsDevDialogOpen } = useDev();
  const { current, setPageCurrent, isNextDisabled, setIsNextDisabled } = usePagination();
  const { selectAllPads, orders, setOrders } = useOrders();

  // ------------------------------------------------------------------------ //

  const hasDrinkSubtypes = orders.some((order) => order?.drinkType?.hasSubtypes);

  const pathnames = (
    hasDrinkSubtypes
      ? ROUTES_CONFIG.map((route) => route.path)
      : ROUTES_CONFIG.map((route) => route.path).filter((pathname) => pathname !== PATHS.DRINK_SUBTYPE)
  ) as RoutePath[];

  // ------------------------------------------------------------------------ //

  // useEffect(() => {
  //   setIsNextDisabled(true);
  // }, [location.pathname]);

  useEffect(() => {
    if (orders.length === 0 && location.pathname !== PATHS.HOME) {
      navigate(PATHS.HOME);
    }
  }, [orders, location.pathname, navigate]);

  log('__DEV: isPending', 'grey', isPending);

  // ------------------------------------------------------------------------ //

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
  const isVisibleNextButton = location.pathname !== PATHS.FINAL_TEMPERATURE;
  // const isVisibleNextButton = current < total;

  return (
    <footer css={styles}>
      <div className="controls">
        <ButtonControl className="btn-control" onClick={() => setIsDevDialogOpen(true)}>
          DATA
        </ButtonControl>
        {location.pathname === PATHS.HOME && <MockOrdersButton />}
        {location.pathname === PATHS.HOME && (
          <ButtonControl className="btn-control" onClick={selectAllPads}>
            ALL
          </ButtonControl>
        )}
        {isVisibleBackButton && (
          <ButtonControl className="btn-control" onClick={handleBack} disabled={isPending}>
            « Back
          </ButtonControl>
        )}
        {isVisibleNextButton && (
          <ButtonControl className="btn-control" onClick={handleNext} disabled={isNextDisabled || isPending}>
            Next »
          </ButtonControl>
        )}
        {location.pathname === PATHS.FINAL_TEMPERATURE && (
          <ButtonControl
            className="btn-control btn-start"
            onClick={handleStart}
            disabled={isNextDisabled || isCalculating || isPending}
          >
            {isCalculating ? 'Calculating...' : 'START'}
          </ButtonControl>
        )}
      </div>
    </footer>
  );
};
