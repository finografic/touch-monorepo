import { startTransition, useCallback, useEffect } from 'react';
import { Col, Row } from 'react-grid-system';
import { MenuPad } from 'components/MenuPad';
import { Pad } from 'components/Pad';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useSession } from 'providers/SessionProvider';
import { styles } from './MainPage.styles';
import type { PadType, PadUI } from 'types/ui.types';
import type { DataEntry } from 'types/data.types';
import type { OrderFieldKey } from 'types/orders.types';
import { ORDER_ITEMS_CONFIG } from 'constants/orders.constants';
import { useNavigateState } from 'routes/hooks/useNavigateState';
// import { ACTION_BUTTONS_CONFIG } from 'pages/MainPage/menu.config';

interface PadUITest {
  id: string;
  key?: string;
  label: string;
  type: PadType;
  isChecked: boolean;
  disabled?: boolean;
  metadata?: DataEntry;
}

export interface PadTestProps extends PadUITest {
  fieldKey: OrderFieldKey;
  className?: string;
}

export function MainPage() {
  const { navigate } = useNavigateState();
  const { orders } = useOrders();
  const { createSession, assignOrdersToSession, currentSessionId } = useSession();
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

  const ACTION_BUTTONS_CONFIG: PadUI[] = [
    {
      id: 'button-program-time',
      label: 'Programar Tiempo',
      type: 'button',
      name: 'main',
      className: 'pad-rect',
      isChecked: false,
      disabled: true,
      value: { id: 'button-program-time', name: 'BUTTON_PROGRAM_TIME' },
    },
    {
      id: 'button-program-product',
      label: 'Programar Producto',
      type: 'button',
      name: 'main',
      className: 'pad-rect',
      isChecked: false,
      disabled: !numSelected,
      value: { id: 'button-program-product', name: 'BUTTON_PROGRAM_PRODUCT' },
    },
    {
      id: 'button-repeat-selection',
      label: 'Repetir Selección',
      type: 'button',
      name: 'main',
      className: 'pad-rect',
      isChecked: false,
      disabled: true,
      value: { id: 'button-repeat-selection', name: 'BUTTON_REPEAT_SELECTION' },
    },
  ];

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
            {ACTION_BUTTONS_CONFIG.map((pad: any) => (
              <Pad key={pad.id} {...pad} label={pad.label} className={pad.className} />
            ))}
          </div>
        </Col>
      </Row>
    </section>
  );
}
