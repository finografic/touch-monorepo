import { /* startTransition, useCallback, */ useEffect, useRef } from 'react';
import { Col, Row } from 'react-grid-system';
import { PadMenu } from 'components/Pads/PadMenu';
import { PadAction } from 'components/Pads/PadAction/PadAction';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useButtonConfig } from 'hooks/useButtonConfig';
import { useOrderItemsConfig } from 'hooks/useOrderItemsConfig';
import { styles } from './MainPage.styles';
import { Flex } from '@radix-ui/themes';
// import { useNavigateState } from 'routes/hooks/useNavigateState';

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
    // setIsNextVisible(false);
  }, [numSelected, setIsNextDisabled]);

  // TODO: NEW - MODE BUTTON !! (SECRET PAGE for ADMIN)

  // Determine which slots go in the main grid vs separate position
  const totalSlots = orderItemsConfig.length;
  const mainGridSlots = orderItemsConfig.slice(0, totalSlots - 1); // All except the last
  const lastSlot = orderItemsConfig[totalSlots - 1]; // The last slot

  return (
    <Flex css={styles} gap="3" direction="column">
      <Row className="menu-main">
        <Col>
          <div className="menu-grid-left">
            {/* Menu grid based on configuration */}
            {mainGridSlots.map(({ itemType, number }) => (
              <PadMenu key={number} itemType={itemType} number={number} />
            ))}
          </div>
        </Col>

        <Col>
          <div className="menu-grid-right">
            {/* Last slot positioned separately */}
            {lastSlot && (
              <PadMenu key={lastSlot.number} itemType={lastSlot.itemType} number={lastSlot.number} />
            )}
            <div className="pad-special power" />
          </div>
        </Col>

        <Col>
          <div className="menu-grid-base">
            {contentButtons.map((buttonProps) => (
              <PadAction key={buttonProps.id} {...buttonProps} />
            ))}
          </div>
        </Col>
      </Row>
    </Flex>
  );
}
