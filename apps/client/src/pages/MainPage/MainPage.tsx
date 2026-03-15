import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Spinner } from '@finografic/design-system/components';

import { PadAction } from 'components/Pads/PadAction/PadAction';

import { useSlotItemsConfig } from 'hooks/useSlotItemsConfig';
import { useFiltersContext } from 'providers/FiltersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useTimers } from 'providers/TimersProvider';
import { useGetSlotSpecialConfig } from 'queries/app-configuration';
import { useGetDefaultMode } from 'queries/modes/useGetDefaultMode';

import { ALT_SLOT_NUMBER, getGridDimensions, getGridLevelFromSlotCount } from 'config/app/slots.config';
import { MainSlotGrid } from './MainSlotGrid/MainSlotGrid';
import type { SlotMeta } from './MainPage.types';
import { useMainPageConfig } from './useMainPageConfig';
import { styles } from './MainPage.styles';

export function MainPage() {
  const location = useLocation();
  const { orders } = useOrders();
  const { timers } = useTimers();
  const { contentButtons } = useMainPageConfig();
  const { setIsNextDisabled } = usePagination();
  const { setFilter } = useFiltersContext();
  const { currentSessionId, sessions } = useSession();
  const { setSelectedSlots, selectedSlots } = useLayoutUi();
  const { allSlots: slotsConfig, isLoading } = useSlotItemsConfig();
  const { data: gridSpecialConfig } = useGetSlotSpecialConfig('special_grid');
  const { data: altSpecialConfig } = useGetSlotSpecialConfig('special_alt');

  // Check if we're returning from a completed flow (not a cancellation)
  const flowCompleted = (location.state as any)?.flowCompleted === true;

  // 🚀 PERFORMANCE OPTIMIZATION: Use ref to prevent re-fetching on every render
  const hasInitializedMode = useRef(false);
  const hasRestoredSlots = useRef(false);

  // 🚀 PERFORMANCE OPTIMIZATION: Pre-fetch default mode on MainPage (only once)
  const { data: defaultMode, isLoading: isModeLoading } = useGetDefaultMode();

  useEffect(function clearSelectedSlots() {
    if (location.state?.clearSelectedSlots === true) {
      setSelectedSlots([]);
    }
  }, []);

  // 🚀 PERFORMANCE OPTIMIZATION: Set default mode filter when loaded (only once)
  useEffect(
    function initializeDefaultModeFilter() {
      if (defaultMode && !isModeLoading && !hasInitializedMode.current) {
        hasInitializedMode.current = true;
        const modeFilter = {
          id: defaultMode.id,
          name: defaultMode.name,
        };
        setFilter('mode', modeFilter);
      }
    },
    [defaultMode, isModeLoading, setFilter],
  );

  // Restore selected slots from current session when navigating back to MainPage
  // BUT: Skip restoration if we're returning from a completed flow (not a cancellation).
  // Do NOT restore slots that have active timers (e.g. after Main→Admin→Main with Time Flow
  // still "current" — those slots are now timers and must stay unchecked).
  useEffect(
    function restoreSelectedSlots() {
      // Don't restore if flow was completed (START was clicked, not CANCEL)
      if (flowCompleted) {
        return;
      }

      if (currentSessionId && sessions[currentSessionId] && !hasRestoredSlots.current) {
        const session = sessions[currentSessionId];
        const sessionSlotNumbers = session.slotNumbers;

        // Only restore if we have slotNumbers and selectedSlots is empty or doesn't match
        if (sessionSlotNumbers.length > 0) {
          const slotsWithActiveTimers = new Set(
            timers
              .filter((t) => t.status === 'processing' || t.status === 'completed')
              .map((t) => t.slotNumber),
          );
          const sessionSlotNumbersToRestore = sessionSlotNumbers.filter(
            (num) => !slotsWithActiveTimers.has(num),
          );

          const currentSlotNumbers = selectedSlots.map((slot) => slot.slotNumber);
          const slotNumbersMatch =
            sessionSlotNumbersToRestore.every((num) => currentSlotNumbers.includes(num)) &&
            currentSlotNumbers.length === sessionSlotNumbersToRestore.length;

          if (!slotNumbersMatch && sessionSlotNumbersToRestore.length > 0) {
            // Rebuild selectedSlots only for session slots that do NOT have active timers
            const restoredSlots: SlotMeta[] = sessionSlotNumbersToRestore
              .map((slotNumber) => {
                const orderConfig = slotsConfig.find((config) => config.slotNumber === slotNumber);
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
    },
    [currentSessionId, sessions, selectedSlots, setSelectedSlots, slotsConfig, flowCompleted, timers],
  );

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

  if (isLoading || !slotsConfig) {
    return <Spinner />;
  }

  // Grid dimensions derived from active slot count via the discrete level system (0=Small, 1=Medium, 2=Large)
  const activeSlots = slotsConfig.filter((slot) => slot.isActive);
  const { columns, rows } = getGridDimensions(getGridLevelFromSlotCount(activeSlots.length));

  // Special slot (e.g. Slot 10) only when: columns >= 3 (data.is_visible) AND switch ON (is_active)
  const showSpecialSlot =
    gridSpecialConfig?.data?.is_visible === true && gridSpecialConfig?.isActive === true;

  const showSpecialAltSlot =
    altSpecialConfig?.data?.is_visible === true && altSpecialConfig?.isActive === true;
  // const altSlotNumber = altSpecialConfig?.data?.slot_number ?? ALT_SLOT_NUMBER;

  return (
    <div css={styles}>
      <div className="main-page-buttons-container">
        <MainSlotGrid
          slots={activeSlots}
          columns={columns}
          rows={rows}
          showSpecialSlot={showSpecialSlot}
          showSpecialAltSlot={showSpecialAltSlot}
          altSlotNumber={ALT_SLOT_NUMBER}
        />

        <div className="content-buttons">
          {contentButtons.map((buttonProps) => (
            <PadAction key={buttonProps.id} {...buttonProps} />
          ))}
        </div>
      </div>
    </div>
  );
}
