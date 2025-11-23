import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { Flex, Spinner } from '@radix-ui/themes';
import { PadAction } from 'components/Pads/PadAction/PadAction';

import { useButtonConfig } from 'hooks/useButtonConfig';
import { useSlotItemsConfig } from 'hooks/useSlotItemsConfig';
import { useFiltersContext } from 'providers/FiltersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useTimers } from 'providers/TimersProvider';
import { useGetDefaultMode } from 'queries/modes/useGetDefaultMode';
import { useGetSlotConfigurations } from 'queries/slot-configurations';

import { MainPageSlotGrid } from './MainPageSlotGrid/MainPageSlotGrid';
import type { SlotMeta } from './MainPage.types';
import { styles } from './MainPage.styles';

export function MainPage() {
  const location = useLocation();
  const { orders } = useOrders();
  const { timers } = useTimers();
  const { contentButtons } = useButtonConfig();
  const { setIsNextDisabled } = usePagination();
  const { setFilter } = useFiltersContext();
  const { data: slotsConfig, isLoading, error } = useGetSlotConfigurations();
  const { currentSessionId, sessions } = useSession();
  const { setSelectedSlots, selectedSlots } = useLayoutUi();
  const orderItemsConfig = useSlotItemsConfig();

  // Check if we're returning from a completed flow (not a cancellation)
  const flowCompleted = (location.state as any)?.flowCompleted === true;

  // 🚀 PERFORMANCE OPTIMIZATION: Use ref to prevent re-fetching on every render
  const hasInitializedMode = useRef(false);
  const hasRestoredSlots = useRef(false);

  // 🚀 PERFORMANCE OPTIMIZATION: Pre-fetch default mode on MainPage (only once)
  const { data: defaultMode, isLoading: isModeLoading } = useGetDefaultMode();

  // 🚀 PERFORMANCE OPTIMIZATION: Set default mode filter when loaded (only once)
  useEffect(() => {
    if (defaultMode && !isModeLoading && !hasInitializedMode.current) {
      hasInitializedMode.current = true;

      const modeFilter = {
        id: defaultMode.id,
        name: defaultMode.name,
      };
      setFilter('mode', modeFilter);
    }
  }, [defaultMode, isModeLoading, setFilter]);

  // Restore selected slots from current session when navigating back to MainPage
  // BUT: Skip restoration if we're returning from a completed flow (not a cancellation)
  useEffect(() => {
    // Don't restore if flow was completed (START was clicked, not CANCEL)
    if (flowCompleted) {
      return;
    }

    if (currentSessionId && sessions[currentSessionId] && !hasRestoredSlots.current) {
      const session = sessions[currentSessionId];
      const sessionSlotNumbers = session.slotNumbers;

      // Only restore if we have slotNumbers and selectedSlots is empty or doesn't match
      if (sessionSlotNumbers.length > 0) {
        const currentSlotNumbers = selectedSlots.map((slot) => slot.slotNumber);
        const slotNumbersMatch =
          sessionSlotNumbers.every((num) => currentSlotNumbers.includes(num)) &&
          currentSlotNumbers.length === sessionSlotNumbers.length;

        if (!slotNumbersMatch) {
          // Rebuild selectedSlots from session's slotNumbers
          const restoredSlots: SlotMeta[] = sessionSlotNumbers
            .map((slotNumber) => {
              const orderConfig = orderItemsConfig.find((config) => config.slotNumber === slotNumber);
              if (orderConfig) {
                return {
                  slotType: orderConfig.slotType,
                  slotNumber,
                  isChecked: true,
                  status: 'idle' as const,
                };
              }
              return null;
            })
            .filter((slot): slot is NonNullable<typeof slot> => slot !== null);

          if (restoredSlots.length > 0) {
            setSelectedSlots(restoredSlots);
            hasRestoredSlots.current = true;
          }
        } else {
          hasRestoredSlots.current = true;
        }
      }
    } else if (!currentSessionId) {
      // Reset the flag when there's no current session
      hasRestoredSlots.current = false;
    }
  }, [currentSessionId, sessions, selectedSlots, setSelectedSlots, orderItemsConfig, flowCompleted]);

  // 🚀 PERFORMANCE OPTIMIZATION: Use Map for O(1) timer lookups (memoized)
  const timerMap = useMemo(() => {
    return new Map(timers.map((t) => [t.slotNumber, t]));
  }, [timers]);

  // 🚀 PERFORMANCE OPTIMIZATION: Memoize available orders calculation
  const availableOrders = useMemo(() => {
    return orders.filter((order) => {
      if (!order.isSelected) return false;

      // Check if there's a timer for this order using Map lookup
      const timer = timerMap.get(order.slotNumber);
      if (timer && (timer.status === 'processing' || timer.status === 'completed')) {
        return false; // Exclude orders with active timers
      }

      return true; // Include orders without timers
    });
  }, [orders, timerMap]);

  const numSelected = availableOrders.length;

  useEffect(() => {
    setIsNextDisabled(numSelected === 0);
  }, [numSelected, setIsNextDisabled]);

  if (isLoading) {
    return <Spinner size="3" />;
  }

  // Dynamically determine grid dimensions
  const rows = 3; // Always 3 rows
  const totalSlots = slotsConfig.filter((slot) => slot.isActive).length;
  const columns = Math.floor((totalSlots - 1) / rows); // Dynamic columns (2,3,4,5)

  return (
    <Flex css={styles} direction="column">
      <div className="main-content">
        <MainPageSlotGrid slots={slotsConfig} columns={columns} rows={rows} />

        <div className="content-buttons">
          {contentButtons.map((buttonProps) => (
            <PadAction key={buttonProps.id} {...buttonProps} />
          ))}
        </div>
      </div>
    </Flex>
  );
}
