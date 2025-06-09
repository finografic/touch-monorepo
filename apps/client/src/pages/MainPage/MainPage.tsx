import { useEffect } from 'react';
import { Col, Row } from 'react-grid-system';
import { MenuPad } from 'components/MenuPad';
import { Pad } from 'components/Pad';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { styles } from './MainPage.styles';
import type { PadType, PadUI } from 'types/ui.types';
import type { DataEntry } from 'types/data.types';
import type { OrderFieldKey } from 'types/orders.types';
import { ORDER_ITEMS_CONFIG } from 'constants/orders.constants';

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

export const ACTION_BUTTONS_CONFIG: PadUI[] = [
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
    disabled: true,
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

export function MainPage() {
  const { orders } = useOrders();
  const { setIsNextDisabled } = usePagination();

  const numSelected = Object.values(orders).filter((order) => order.isSelected).length;

  useEffect(() => {
    setIsNextDisabled(numSelected === 0);
  }, [numSelected, setIsNextDisabled]);

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
