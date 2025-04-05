import { styles } from './MenuPage.styles';

export function MenuPage() {
  return (
    <div css={styles}>
      <div className="menu-grid">
        {/* First row */}
        <div className="point active">1</div>
        <div className="point">2</div>
        <div className="point">3</div>
        <div className="point error">10</div>

        {/* Second row */}
        <div className="point">4</div>
        <div className="point">5</div>
        <div className="point">6</div>
        <div className="point special">11</div>

        {/* Third row */}
        <div className="point">7</div>
        <div className="point">8</div>
        <div className="point">9</div>
      </div>

      <div className="controls">
        <button className="control-btn">ALL</button>
        <button className="control-btn">« Back</button>
        <button className="control-btn">Next »</button>
      </div>
    </div>
  );
}
