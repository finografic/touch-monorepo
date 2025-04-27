import { useEffect } from 'react';
import { Col, Row } from 'react-grid-system';
import { MenuPad } from 'components/MenuPad';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { styles } from './MenuPage.styles';

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
            <MenuPad type="A" number={0} className="first" />
            <MenuPad type="B" number={1} />
            <MenuPad type="B" number={2} />

            {/* Second row */}
            <MenuPad type="B" number={3} />
            <MenuPad type="B" number={4} />
            <MenuPad type="B" number={5} />

            {/* Third row */}
            <MenuPad type="B" number={6} />
            <MenuPad type="B" number={7} />
            <MenuPad type="B" number={8} />
          </div>
        </Col>

        <Col>
          <div className="menu-grid-right">
            <div className="pad-special error" />
            <div className="pad-special power" />
          </div>
        </Col>
      </Row>
    </section>
  );
}
