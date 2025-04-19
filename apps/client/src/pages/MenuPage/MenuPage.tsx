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

  log('ENV_META', 'cyan', import.meta.env.VITE_API_URL);
  log('ENV_META', 'hotpink', process.env.API_URL);

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

            <MenuPad className="first" />
            <MenuPad number={1} />
            <MenuPad number={2} />

            {/* Second row */}
            <MenuPad number={3} />
            <MenuPad number={4} />
            <MenuPad number={5} />

            {/* Third row */}
            <MenuPad number={6} />
            <MenuPad number={7} />
            <MenuPad number={8} />
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
