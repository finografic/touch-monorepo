import { Link } from 'react-router-dom';
import { Container } from 'react-grid-system';
import { styles } from './HomePage.css';

export function HomePage() {
  return (
    <div css={styles}>
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

        <Link to="/docs" className="docs-link">
          System Documentation
        </Link>
      </div>
      {/* </Container> */}
    </div>
  );
}
