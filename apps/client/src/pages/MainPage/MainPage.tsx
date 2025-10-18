import { useEffect, useRef } from 'react';
import { Col, Row } from 'react-grid-system';

import { Flex, Spinner } from '@radix-ui/themes';

import { PadAction } from 'components/Pads/PadAction/PadAction';
import { PadSlot } from 'components/Pads/PadSlot';
import { useButtonConfig } from 'hooks/useButtonConfig';
import { useFiltersContext } from 'providers/FiltersProvider';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useTimers } from 'providers/TimersProvider';
import { useGetDefaultMode } from 'queries/modes/useGetDefaultMode';
import { useGetSlotConfigurations } from 'queries/slot-configurations';
// import { useSlotItemsConfig } from 'hooks/useSlotItemsConfig';
import { styles } from './MainPage.styles';

export function MainPage() {
  const { orders } = useOrders();
  const { timers } = useTimers();
  const { contentButtons } = useButtonConfig();
  const { setIsNextDisabled } = usePagination();
  const { setFilter } = useFiltersContext();
  // const slotsConfig = useslotsConfig();
  const { data: slotsConfig, isLoading, error } = useGetSlotConfigurations();

  // 🚀 PERFORMANCE OPTIMIZATION: Use ref to prevent re-fetching on every render
  const hasInitializedMode = useRef(false);

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

  // 🚀 PERFORMANCE OPTIMIZATION: Use Map for O(n) timer lookups
  const timerMap = new Map(timers.map((t) => [t.slotNumber, t]));

  // Get currently selected orders that are not processing or completed
  const availableOrders = orders.filter((order) => {
    if (!order.isSelected) return false;

    // Check if there's a timer for this order using Map lookup
    const timer = timerMap.get(order.slotNumber);
    if (timer && (timer.status === 'processing' || timer.status === 'completed')) {
      return false; // Exclude orders with active timers
    }

    return true; // Include orders without timers
  });
  const numSelected = availableOrders.length;

  useEffect(() => {
    setIsNextDisabled(numSelected === 0);
  }, [numSelected, setIsNextDisabled]);

  if (isLoading) {
    return <Spinner size="3" />;
  }

  // Dynamically determine grid dimensions
  const totalSlots = slotsConfig?.length;
  const mainGridSlots = slotsConfig.slice(0, totalSlots - 1); // All except the last
  const lastSlot = slotsConfig[totalSlots - 1]; // The last slot

  // log('MAIN_PAGE_SLOTS:', 'cyan', mainGridSlots);

  const rows = 3; // Always 3 rows
  const columns = Math.floor((totalSlots - 1) / rows); // Dynamic columns

  return (
    <Flex css={styles} gap="3" direction="column">
      <Row
        className="menu-main"
        style={{
          minWidth: columns <= 3 ? '1000px' : columns === 4 ? '1200px' : '1350px',
        }}
      >
        <Col>
          <div className="menu-grid-left">
            {/* Render grid in true column-major order: outer loop rows, inner loop columns */}
            <div
              style={{
                gap: '2.5rem',
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                minWidth: columns <= 3 ? '420px' : columns === 4 ? '560px' : '600px',
                transform:
                  columns <= 3 ? 'translateX(4rem)' : columns === 4 ? 'translateX(1rem)' : 'translateX(2rem)',
              }}
            >
              {Array.from({ length: rows }).map((_, rowIdx) =>
                Array.from({ length: columns }).map((_, colIdx) => {
                  const slotNumber = rowIdx + colIdx * rows + 1;
                  const slot = mainGridSlots.find((s) => s.slotNumber === slotNumber);
                  return slot ? (
                    <PadSlot key={slot.slotNumber} slotType={slot.slotType} slotNumber={slot.slotNumber} />
                  ) : null;
                }),
              )}
            </div>
          </div>
        </Col>

        <Col>
          <div
            className="menu-grid-right"
            style={{
              maxWidth: '360px',
              alignItems: columns <= 3 ? 'center' : columns === 4 ? 'center' : 'flex-end',
              transform:
                columns <= 3
                  ? 'translateX(3rem)'
                  : columns === 4
                    ? 'translateX(1.5rem)'
                    : 'translateX(2.5rem)',
            }}
          >
            {/* Last slot positioned separately */}
            {lastSlot && (
              <PadSlot
                key={lastSlot.slotNumber}
                slotType={lastSlot.slotType}
                slotNumber={lastSlot.slotNumber}
                variant="large"
              />
            )}
            <div className="pad-special power" />
          </div>
        </Col>

        <Col>
          <div
            className="menu-grid-base"
            style={{
              transform:
                columns <= 3 ? 'translateX(4rem)' : columns === 4 ? 'translateX(0)' : 'translateX(2.5rem)',
            }}
          >
            {contentButtons.map((buttonProps) => (
              <PadAction key={buttonProps.id} {...buttonProps} />
            ))}
          </div>
        </Col>
      </Row>
    </Flex>
  );
}
