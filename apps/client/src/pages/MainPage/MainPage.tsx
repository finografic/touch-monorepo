import { startTransition, useCallback, useEffect } from 'react';
import { Col, Row } from 'react-grid-system';
import { MenuPad } from 'components/MenuPad';
import { ActionButton } from 'components/ActionButton/ActionButton';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useSession } from 'providers/SessionProvider';
import { useNavigationConfig } from 'hooks/useNavigationConfig';
import { styles } from './MainPage.styles';
import { ORDER_ITEMS_CONFIG } from 'constants/orders.constants';
import { useNavigateState } from 'routes/hooks/useNavigateState';

export function MainPage() {
  const { navigate } = useNavigateState();
  const { orders } = useOrders();
  const { createSession, assignOrdersToSession, currentSessionId } = useSession();
  const { contentButtons } = useNavigationConfig();
  const {
    setIsNextDisabled,
    // setIsNextVisible
  } = usePagination();

  // Get currently selected orders that are not processing or completed
  const availableOrders = orders.filter(
    (order) =>
      order.isSelected && order.process.status !== 'processing' && order.process.status !== 'completed',
  );
  const numSelected = availableOrders.length;

  useEffect(
    function createConfigurationSessionForNewlySelectedOrders() {
      const newlySelectedOrders = orders.filter(
        (order) => order.isSelected && order.process.status === 'idle',
      );

      if (newlySelectedOrders.length > 0) {
        // Create new session if we don't have one
        let sessionId = currentSessionId;

        if (!sessionId) {
          sessionId = createSession();
        }

        // Assign newly selected orders to current session
        assignOrdersToSession(
          sessionId,
          newlySelectedOrders.map((order) => order.itemNumber),
        );
      }
    },
    [orders, currentSessionId, createSession, assignOrdersToSession],
  );

  useEffect(() => {
    setIsNextDisabled(numSelected === 0);
    // setIsNextVisible(false);
  }, [numSelected, setIsNextDisabled]);

  const handleNext = useCallback(() => {
    startTransition(() => {
      navigate('/drink-type');
    });
  }, [navigate]);

  // TODO: NEW - MODE BUTTON !! (SECRET PAGE for ADMIN)

  return (
    <section css={styles}>
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
    </section>
  );
}
