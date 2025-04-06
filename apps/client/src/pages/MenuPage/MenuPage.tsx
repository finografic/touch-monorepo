import { styles } from './MenuPage.styles';
import { Col, Row } from 'react-grid-system';
import { useOrders } from '../../providers/OrdersProvider';
import { useNavigate } from 'react-router-dom';
import { Pad } from '../../components/Pad';

export function MenuPage() {
  const { activePads, selectAllPads } = useOrders();
  const navigate = useNavigate();

  const hasSelectedPads = Object.values(activePads).some((isActive) => isActive);

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
