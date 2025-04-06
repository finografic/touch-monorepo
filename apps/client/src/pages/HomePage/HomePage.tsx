import { Link } from 'react-router-dom';
import { styles } from './HomePage.styles';
import { HeaderDashboard } from 'components/HeaderDashboard/HeaderDashboard';

export const HomePage = () => {
  return (
    <div css={styles}>
      <HeaderDashboard />
      {/* <Container> */}
      <div className="splash-screen">
        <div className="logo-container">
          <h1 className="app-title">ServiFresc</h1>
          <p className="app-subtitle">Smart Beverage Temperature Control</p>
        </div>

        <div className="feature-grid">
          <div className="feature-item">
            <span className="feature-number">11</span>
            <span className="feature-text">Dispensing Points</span>
          </div>
          <div className="feature-item">
            <span className="feature-number">7</span>
            <span className="feature-text">Beverage Types</span>
          </div>
          <div className="feature-item">
            <span className="feature-number">8</span>
            <span className="feature-text">Volume Options</span>
          </div>
        </div>

        <div className="system-status">
          <div className="status-indicator online"></div>
          System Ready
        </div>

        <div className="bottom-links">
          <Link to="/docs" className="docs-link">
            System Documentation
          </Link>
          <span className="separator">·</span>
          <Link to="/menu" className="menu-link">
            Dispensing Menu
          </Link>
        </div>
      </div>
      {/* </Container> */}
    </div>
  );
};
