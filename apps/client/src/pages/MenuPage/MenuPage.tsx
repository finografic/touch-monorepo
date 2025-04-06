import { styles } from './MenuPage.styles';
import { Col, Row } from 'react-grid-system';
import { useOrders } from '../../providers/OrdersProvider';
import { useNavigate } from 'react-router-dom';

export function MenuPage() {
  const { activePads, setActivePads, handleNextStep } = useOrders();
  const navigate = useNavigate();

  const handlePadToggle = (padNumber: number) => {
    setActivePads({
      ...activePads,
      [padNumber]: !activePads[padNumber],
    });
  };

  const handleSelectAll = () => {
    setActivePads({
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
      9: true,
    });
  };

  const onNext = () => {
    handleNextStep();
    navigate('/beverage-type'); // We'll create this route later
  };

  return (
    <div css={styles}>
      <section className="menu-main">
        <Row className="menu-main">
          <Col>
            <div className="menu-grid-left">
              {/* First row */}
              <div className="pad first" />
              <div className={`pad ${activePads[2] ? 'active' : ''}`} onClick={() => handlePadToggle(2)} />
              <div className={`pad ${activePads[3] ? 'active' : ''}`} onClick={() => handlePadToggle(3)} />

              {/* Second row */}
              <div className={`pad ${activePads[4] ? 'active' : ''}`} onClick={() => handlePadToggle(4)} />
              <div className={`pad ${activePads[5] ? 'active' : ''}`} onClick={() => handlePadToggle(5)} />
              <div className={`pad ${activePads[6] ? 'active' : ''}`} onClick={() => handlePadToggle(6)} />

              {/* Third row */}
              <div className={`pad ${activePads[7] ? 'active' : ''}`} onClick={() => handlePadToggle(7)} />
              <div className={`pad ${activePads[8] ? 'active' : ''}`} onClick={() => handlePadToggle(8)} />
              <div className={`pad ${activePads[9] ? 'active' : ''}`} onClick={() => handlePadToggle(9)} />
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

      <div className="controls">
        <button className="control-btn" onClick={handleSelectAll}>
          ALL
        </button>
        <button className="control-btn">« Back</button>
        <button className="control-btn" onClick={onNext}>
          Next »
        </button>
      </div>
    </div>
  );
}
