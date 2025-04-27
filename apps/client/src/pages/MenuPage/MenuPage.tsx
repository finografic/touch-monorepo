import { useEffect } from 'react';
import { Col, Row } from 'react-grid-system';
import { MenuPad } from 'components/MenuPad';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { styles } from './MenuPage.styles';

// <MenuPad type="A" number={0} className="first" />
// {/* <div className="pad-special error" /> */}

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
            <MenuPad slotType="A" number={0} />
            <MenuPad slotType="B" number={1} />
            <MenuPad slotType="B" number={2} />

            {/* Second row */}
            <MenuPad slotType="B" number={3} />
            <MenuPad slotType="B" number={4} />
            <MenuPad slotType="B" number={5} />

            {/* Third row */}
            <MenuPad slotType="B" number={6} />
            <MenuPad slotType="B" number={7} />
            <MenuPad slotType="B" number={8} />
          </div>
        </Col>

        <Col>
          <div className="menu-grid-right">
            <MenuPad slotType="C" number={9} />
            <div className="pad-special power" />
          </div>
        </Col>
      </Row>
    </section>
  );
}
