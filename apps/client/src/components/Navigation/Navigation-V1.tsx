import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { ButtonControl } from 'components/ButtonControl/ButtonControl';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { PATHS, type RoutePath, ROUTES_CONFIG } from 'routes/routes.config';
import { MockOrdersButton } from '../../dev-tools/DevMockOrders/MockOrdersButton';
import { styles } from '../Footer/Footer.styles';
import { useTemperatureCalculation } from 'hooks/useTemperatureCalculation';
// import { useContent } from 'providers/ContentProvider/ContentContext';
import { useCallback, useEffect, useMemo, useTransition } from 'react';
// import { useQueryClient } from '@tanstack/react-query';
// import { GET_TEMPERATURE_SETTINGS_QUERYKEY } from '../../queries/temperature';
import { Col, Row } from 'react-grid-system';
import { useDev } from 'providers/DevProvider/DevContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useRouteMetadata } from 'routes/providers/RouteMetadataContext';
import { DevFilterResults } from 'src/dev-tools/DevFilterResults/DevFilterResults';

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDevDataVisible } = useDev();
  const [isPending, startTransition] = useTransition();
  // const { route } = useRouteConfig();
  const { routes, routesMetadata } = useRouteMetadata();
  // const queryClient = useQueryClient();
  // const isFetching = queryClient.isFetching() || queryClient.isMutating();

  const { setIsDevDialogOpen } = useDev();
  const { current, setPageCurrent, isPrevDisabled, setIsPrevDisabled, isNextDisabled, setIsNextDisabled } =
    usePagination();
  const { selectAllOrders, orders, setOrders } = useOrders();

  // ------------------------------------------------------------------------ //

  const filters = useMemo((): { hasSubtypes: boolean; drinkTypeId: string } => {
    const filters = orders[0]?.filters;
    if (filters) {
      const hasSubtypes = !!filters.drinkType?.hasSubtypes;
      const drinkTypeId = (filters.drinkType as any)?.id || '';
      return { hasSubtypes, drinkTypeId };
    }
    return { hasSubtypes: false, drinkTypeId: '' };
  }, [orders]);

  const pathnames = useMemo((): RoutePath[] => {
    const paths = ROUTES_CONFIG.map((route) => route.path) as RoutePath[];

    if (filters.hasSubtypes && filters.drinkTypeId) {
      return paths.map((path: RoutePath) =>
        path === PATHS.drinkSubtype
          ? PATHS.drinkSubtype.replace(':drinkTypeId', filters.drinkTypeId as string)
          : path,
      );
    }
    return paths.filter((path: RoutePath) => path !== PATHS.drinkSubtype);
  }, [filters, routes]);

  // ------------------------------------------------------------------------ //

  useEffect(() => {
    if (orders.length === 0 && location.pathname !== PATHS.home) {
      navigate(PATHS.home);
    }
  }, [orders, location.pathname, navigate]);

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
  const isVisibleNextButton = location.pathname !== PATHS.finalTemperature;
  // const isVisibleNextButton = current < total;

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
            {location.pathname === PATHS.finalTemperature && (
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
