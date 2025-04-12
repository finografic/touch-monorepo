import { useEffect } from 'react';
import { styles } from './MenuPage.styles';
import { Col, Row } from 'react-grid-system';
import { Pad } from 'components/Pad';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
export function MenuPage() {
  const { orders } = useOrders();
  const { setIsNextDisabled } = usePagination();

  const numSelected = Object.values(orders).filter((order) => order.isSelected).length;

  useEffect(() => {
    setIsNextDisabled(numSelected === 0);
  }, [numSelected, setIsNextDisabled]);

  // TODO: NEW - MODE BUTTON !! (SECRET PAGE for ADMIN)

  return (
    <div css={styles}>
      <section className="menu-main">
        <Row className="menu-main">
          <Col>
            <div className="menu-grid-left">
              {/* First row */}
              <div className="pad first" />
              <Pad number={1} />
              <Pad number={2} />

              {/* Second row */}
              <Pad number={3} />
              <Pad number={4} />
              <Pad number={5} />

              {/* Third row */}
              <Pad number={6} />
              <Pad number={7} />
              <Pad number={8} />
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
    </div>
  );
}
