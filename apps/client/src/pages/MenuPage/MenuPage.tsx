import { useEffect } from 'react';
import { styles } from './MenuPage.styles';
import { Col, Row } from 'react-grid-system';
import { OrderItemPad } from 'components/OrderItemPad';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';

export const MenuPage = () => {
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
            <div className="pad first" />
            <OrderItemPad number={1} />
            <OrderItemPad number={2} />

            {/* Second row */}
            <OrderItemPad number={3} />
            <OrderItemPad number={4} />
            <OrderItemPad number={5} />

            {/* Third row */}
            <OrderItemPad number={6} />
            <OrderItemPad number={7} />
            <OrderItemPad number={8} />
          </div>
        </Col>

        <Col>
          <div className="menu-grid-right">
            <div className="pad error" />
            <div className="pad special" />
          </div>
        </Col>
      </Row>
    </section>
  );
};
