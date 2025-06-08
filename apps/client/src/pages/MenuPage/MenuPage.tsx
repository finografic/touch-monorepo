import { useEffect } from 'react';
import { Col, Row } from 'react-grid-system';
import { MenuPad } from 'components/MenuPad';
import { Pad } from 'components/Pad';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { styles } from './MenuPage.styles';
import type { PadType, PadUI } from 'types/ui.types';
import type { DataEntry } from 'types/data.types';
import type { OrderFieldKey } from 'types/orders.types';
// import { useRouteConfig } from 'routes/hooks/useRouteConfig';

// <MenuPad type="A" number={0} className="first" />
// {/* <div className="pad-special error" /> */}

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

export const PADS_TOUCH_CONFIG: PadUI[] = [
  {
    id: 'button-program-time',
    label: 'Programar Tiempo',
    type: 'button',
    name: 'home',
    className: 'pad-rect',
    isChecked: false,
    disabled: false,
    value: { id: 'button-program-time', name: 'BUTTON_PROGRAM_TIME' },
  },
  {
    id: 'button-program-product',
    label: 'Programar Producto',
    type: 'button',
    name: 'home',
    className: 'pad-rect',
    isChecked: false,
    disabled: false,
    value: { id: 'button-program-product', name: 'BUTTON_PROGRAM_PRODUCT' },
  },
  {
    id: 'button-repeat-selection',
    label: 'Repetir Selección',
    type: 'button',
    name: 'home',
    className: 'pad-rect',
    isChecked: false,
    disabled: false,
    value: { id: 'button-repeat-selection', name: 'BUTTON_REPEAT_SELECTION' },
  },
  {
    id: 'button-reset',
    label: 'Reset',
    type: 'button',
    name: 'home',
    className: 'pad-rect',
    isChecked: false,
    disabled: false,
    value: { id: 'button-reset', name: 'BUTTON_RESET' },
  },
];

// ======================================================================== //

export function MenuPage() {
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
            {/* First row */}
            <MenuPad itemType="A" number={0} />
            <MenuPad itemType="B" number={1} />
            <MenuPad itemType="B" number={2} />

            {/* Second row */}
            <MenuPad itemType="B" number={3} />
            <MenuPad itemType="B" number={4} />
            <MenuPad itemType="B" number={5} />

            {/* Third row */}
            <MenuPad itemType="B" number={6} />
            <MenuPad itemType="B" number={7} />
            <MenuPad itemType="B" number={8} />
          </div>
        </Col>

        <Col>
          <div className="menu-grid-right">
            <MenuPad itemType="C" number={9} />
            <div className="pad-special power" />
          </div>
        </Col>

        <Col>
          <div className="menu-grid-base">
            {PADS_TOUCH_CONFIG.map((pad: any) => (
              <Pad key={pad.id} {...pad} label={pad.label} className={pad.className} />
            ))}
          </div>
        </Col>
      </Row>
    </section>
  );
}
