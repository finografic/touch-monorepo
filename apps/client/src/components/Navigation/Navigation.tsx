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

export interface NavigationButtonUI {
  id: string;
  label: string;
  type: 'reset' | 'all' | 'back' | 'next' | 'start';
  className?: string;
  disabled?: boolean;
  icon?: 'chevron-left' | 'chevron-right';
}

export const NAVIGATION_BUTTONS_CONFIG: NavigationButtonUI[] = [
  {
    id: 'nav-reset',
    label: 'Reset',
    type: 'reset',
    className: 'nav-button',
  },
  {
    id: 'nav-all',
    label: 'ALL',
    type: 'all',
    className: 'nav-button',
  },
  {
    id: 'nav-back',
    label: 'Back',
    type: 'back',
    className: 'nav-button',
    icon: 'chevron-left',
  },
  {
    id: 'nav-next',
    label: 'Next',
    type: 'next',
    className: 'nav-button',
    icon: 'chevron-right',
  },
  {
    id: 'nav-start',
    label: 'START',
    type: 'start',
    className: 'nav-button nav-button-start',
  },
];

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { current, setPageCurrent, isNextDisabled } = usePagination();
  const { selectAllOrders, orders, setOrderProcessing, timerAction } = useOrders();
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

  // Check if there are any completed timers
  const hasCompletedTimers = orders.some((order) => order.process.status === 'completed');

  // Replace handleReset with handleClearCompleted
  const handleClearCompleted = useCallback(() => {
    startTransition(() => {
      // Clear all completed timers by resetting their process status to 'idle'
      orders.forEach((order) => {
        if (order.process.status === 'completed') {
          timerAction('reset', { itemNumber: order.itemNumber });
        }
      });
    });
  }, [orders, setOrderProcessing]);

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
            {NAVIGATION_BUTTONS_CONFIG.map((button) => {
              // Update visibility conditions for reset button
              if (button.type === 'reset' && (!hasCompletedTimers || location.pathname !== PATHS.home))
                return null;
              // Only show ALL on home page
              if (button.type === 'all' && location.pathname !== PATHS.home) return null;
              // Only show Back when not on home page
              if (button.type === 'back' && !isVisibleBackButton) return null;
              // Only show Next when not on temperature page
              if (button.type === 'next' && !isVisibleNextButton) return null;
              // Only show START on temperature page
              if (button.type === 'start' && location.pathname !== PATHS.temperature) return null;

              return (
                <NavigationMenu.Item key={button.id} className="nav-item">
                  <NavigationMenu.Link asChild>
                    <button
                      className={button.className}
                      onClick={() => {
                        switch (button.type) {
                          case 'reset':
                            return handleClearCompleted();
                          case 'all':
                            return selectAllOrders();
                          case 'back':
                            return handleBack();
                          case 'next':
                            return handleNext();
                          case 'start':
                            return handleStart();
                        }
                      }}
                      disabled={
                        button.type === 'next'
                          ? isNextDisabled || isPending
                          : button.type === 'start'
                            ? isLoading || isPending || !temperatureProfilesQuery.data
                            : isPending
                      }
                      data-disabled={
                        button.type === 'next'
                          ? isNextDisabled || isPending
                            ? 'true'
                            : undefined
                          : button.type === 'start'
                            ? isLoading || isPending || !temperatureProfilesQuery.data
                              ? 'true'
                              : undefined
                            : isPending
                              ? 'true'
                              : undefined
                      }
                    >
                      {button.icon === 'chevron-left' && <ChevronLeftIcon />}
                      {button.type === 'start' && isLoading
                        ? 'Calculating...'
                        : isPending
                          ? 'Processing...'
                          : button.label}
                      {button.icon === 'chevron-right' && <ChevronRightIcon />}
                    </button>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              );
            })}
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </nav>
  );
};
