import { /* startTransition, useCallback, */ useEffect } from 'react';
import { Col, Row } from 'react-grid-system';
import { MenuPad } from 'components/MenuPad';
import { ActionButton } from 'components/ActionButton/ActionButton';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useButtonConfig } from 'hooks/useButtonConfig';
import { styles } from './MainPage.styles';
import { ORDER_ITEMS_CONFIG } from 'constants/orders.constants';
import { Flex } from '@radix-ui/themes';
// import { useNavigateState } from 'routes/hooks/useNavigateState';

export function MainPage() {
  const { orders } = useOrders();
  const { createSession, assignOrdersToSession, currentSessionId } = useSession();
  const { contentButtons } = useButtonConfig();
  const { setIsNextDisabled } = usePagination();

  // Get currently selected orders that are not processing or completed
  const availableOrders = orders.filter(
    (order) =>
      order.isSelected && order.process.status !== 'processing' && order.process.status !== 'completed',
  );
  const numSelected = availableOrders.length;

  useEffect(
    function createConfigurationSessionForNewlySelectedOrders() {
      log('__DEV: SESSION - 1', 'grey', currentSessionId);
      const newlySelectedOrders = orders.filter(
        (order) => order.isSelected && order.process.status === 'idle',
      );

      log('__DEV: SESSION - 2', 'grey', currentSessionId);

      // if (newlySelectedOrders.length > 0) {
      // Create new session if we don't have one
      let sessionId = currentSessionId;

      if (!sessionId) {
        sessionId = createSession();
      }

      log('__DEV: SESSION - 3', 'blue', sessionId);

      // Assign newly selected orders to current session
      assignOrdersToSession(
        sessionId,
        newlySelectedOrders.map((order) => order.itemNumber),
      );
      // }
    },
    [orders, currentSessionId, createSession, assignOrdersToSession],
  );

  useEffect(() => {
    setIsNextDisabled(numSelected === 0);
    // setIsNextVisible(false);
  }, [numSelected, setIsNextDisabled]);

  // TODO: NEW - MODE BUTTON !! (SECRET PAGE for ADMIN)

  return (
    <Flex css={styles} gap="3" direction="column">
      <Row className="menu-main">
        <Col>
          <div className="menu-grid-left">
            {/* Menu grid based on configuration */}
            {ORDER_ITEMS_CONFIG.slice(0, 9).map(({ itemType, number }) => (
              <MenuPad key={number} itemType={itemType} number={number} />
            ))}
          </div>
        </Col>

        <Col>
          <div className="menu-grid-right">
            {/* Special pad (type C) */}
            {ORDER_ITEMS_CONFIG.slice(9).map(({ itemType, number }) => (
              <MenuPad key={number} itemType={itemType} number={number} />
            ))}
            <div className="pad-special power" />
          </div>
        </Col>

        <Col>
          <div className="menu-grid-base">
            {contentButtons.map((buttonProps) => (
              <ActionButton key={buttonProps.id} {...buttonProps} />
            ))}
          </div>
        </Col>
      </Row>
    </Flex>
  );
}
