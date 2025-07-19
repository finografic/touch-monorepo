import { /* startTransition, useCallback, */ useEffect, useRef } from 'react';
import { Col, Row } from 'react-grid-system';
import { PadMenu } from 'components/Pads/PadMenu';
import { PadAction } from 'components/Pads/PadAction/PadAction';
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
  const { contentButtons } = useButtonConfig();
  const { setIsNextDisabled } = usePagination();

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

  return (
    <Flex css={styles} gap="3" direction="column">
      <Row className="menu-main">
        <Col>
          <div className="menu-grid-left">
            {/* Menu grid based on configuration */}
            {ORDER_ITEMS_CONFIG.slice(0, 9).map(({ itemType, number }) => (
              <PadMenu key={number} itemType={itemType} number={number} />
            ))}
          </div>
        </Col>

        <Col>
          <div className="menu-grid-right">
            {/* Special pad (type C) */}
            {ORDER_ITEMS_CONFIG.slice(9).map(({ itemType, number }) => (
              <PadMenu key={number} itemType={itemType} number={number} />
            ))}
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
