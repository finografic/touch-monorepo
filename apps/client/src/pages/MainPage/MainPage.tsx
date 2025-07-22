import { useEffect } from 'react';
import { Col, Row } from 'react-grid-system';
import { PadSlot } from 'components/Pads/PadSlot';
import { PadAction } from 'components/Pads/PadAction/PadAction';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useButtonConfig } from 'hooks/useButtonConfig';
import { useOrderItemsConfig } from 'hooks/useOrderItemsConfig';
import { styles } from './MainPage.styles';
import { Flex } from '@radix-ui/themes';

export function MainPage() {
  const { orders } = useOrders();
  const { contentButtons } = useButtonConfig();
  const { setIsNextDisabled } = usePagination();
  const orderItemsConfig = useOrderItemsConfig();

  // Get currently selected orders that are not processing or completed
  const availableOrders = orders.filter(
    (order) =>
      order.isSelected && order.process.status !== 'processing' && order.process.status !== 'completed',
  );
  const numSelected = availableOrders.length;

  useEffect(() => {
    setIsNextDisabled(numSelected === 0);
  }, [numSelected, setIsNextDisabled]);

  // Dynamically determine grid dimensions
  const totalSlots = orderItemsConfig.length;
  const mainGridSlots = orderItemsConfig.slice(0, totalSlots - 1); // All except the last
  const lastSlot = orderItemsConfig[totalSlots - 1]; // The last slot

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
                minWidth: columns <= 3 ? '360px' : columns === 4 ? '560px' : '600px',
                transform:
                  columns <= 3 ? 'translateX(4rem)' : columns === 4 ? 'translateX(1rem)' : 'translateX(2rem)',
              }}
            >
              {Array.from({ length: rows }).map((_, rowIdx) =>
                Array.from({ length: columns }).map((_, colIdx) => {
                  const slotNumber = rowIdx + colIdx * rows + 1;
                  const slot = mainGridSlots.find((s) => s.number === slotNumber);
                  return slot ? (
                    <PadSlot key={slot.number} itemType={slot.itemType} number={slot.number} />
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
                  ? 'translateX(4rem)'
                  : columns === 4
                    ? 'translateX(1.5rem)'
                    : 'translateX(2.5rem)',
            }}
          >
            {/* Last slot positioned separately */}
            {lastSlot && (
              <PadSlot
                key={lastSlot.number}
                itemType={lastSlot.itemType}
                number={lastSlot.number}
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
