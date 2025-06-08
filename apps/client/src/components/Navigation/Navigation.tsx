import { useLocation, useNavigate } from 'react-router-dom';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { PATHS } from 'routes/routes.config';
import { styles } from './Navigation.styles';
import { useCallback, useEffect, useTransition } from 'react';
import { useRoutePathnamesByFilters } from 'routes/hooks/useRoutePathnamesByFilters';
import { useTemperatureControl } from 'hooks/useTemperatureControl';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { current, setPageCurrent, isNextDisabled } = usePagination();
  const { selectAllOrders, orders, setOrderProcessing } = useOrders();
  const { pathnames } = useRoutePathnamesByFilters();

  const { startTemperatureControl, temperatureProfilesQuery, isLoading } = useTemperatureControl({
    onSuccess: (duration) => {
      startTransition(() => {
        // Update process for selected orders
        orders.forEach((order) => {
          if (order.isSelected) {
            setOrderProcessing({ itemNumber: order.itemNumber, duration });
          }
        });

        // Navigate back to first page
        setPageCurrent(0);
        navigate(pathnames[0], { replace: true });
      });
    },
    onError: (error) => {
      // TODO: Show error message to user
      console.error('Failed to control temperature:', error);
    },
  });

  useEffect(() => {
    if (orders.length === 0 && location.pathname !== PATHS.home) {
      navigate(PATHS.home);
    }
  }, [orders, location.pathname, navigate]);

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
    startTemperatureControl();
  }, [startTemperatureControl]);

  const isVisibleBackButton = location.pathname !== PATHS.home;
  const isVisibleNextButton = location.pathname !== PATHS.temperature;

  return (
    <nav css={styles}>
      <div className="nav-wrapper">
        <NavigationMenu.Root className="nav-root">
          <NavigationMenu.List className="nav-list">
            {location.pathname === PATHS.home && (
              <NavigationMenu.Item className="nav-item">
                <NavigationMenu.Link asChild>
                  <button className="nav-button" onClick={selectAllOrders}>
                    ALL
                  </button>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            )}

            {isVisibleBackButton && (
              <NavigationMenu.Item className="nav-item">
                <NavigationMenu.Link asChild>
                  <button
                    className="nav-button"
                    onClick={handleBack}
                    disabled={isPending}
                    data-disabled={isPending ? 'true' : undefined}
                  >
                    <ChevronLeftIcon /> Back
                  </button>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            )}

            {isVisibleNextButton && (
              <NavigationMenu.Item className="nav-item">
                <NavigationMenu.Link asChild>
                  <button
                    className="nav-button"
                    onClick={handleNext}
                    disabled={isNextDisabled || isPending}
                    data-disabled={isNextDisabled || isPending ? 'true' : undefined}
                  >
                    Next <ChevronRightIcon />
                  </button>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            )}

            {location.pathname === PATHS.temperature && (
              <NavigationMenu.Item className="nav-item">
                <NavigationMenu.Link asChild>
                  <button
                    className={clsx('nav-button', 'nav-button-start')}
                    onClick={handleStart}
                    disabled={isLoading || isPending || !temperatureProfilesQuery.data}
                    data-disabled={
                      isLoading || isPending || !temperatureProfilesQuery.data ? 'true' : undefined
                    }
                  >
                    {isLoading ? 'Calculating...' : isPending ? 'Processing...' : 'START'}
                  </button>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            )}
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </nav>
  );
};
