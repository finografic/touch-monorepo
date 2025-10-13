import React, { useState } from 'react';
import { PadNumeric } from './PadNumeric';

/**
 * Example demonstrating PadNumeric with enhanced key-repeat behavior
 * like macOS system settings and looping functionality
 */
export const PadNumericExample = () => {
  const [seconds, setSeconds] = useState(30);
  const [minutes, setMinutes] = useState(5);
  const [hours, setHours] = useState(12);

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2>PadNumeric Examples</h2>

      {/* Seconds with looping (0-59 wrap) */}
      <div>
        <h3>Seconds (with looping)</h3>
        <PadNumeric
          label="Segundos"
          value={seconds}
          onChange={setSeconds}
          min={0}
          max={59}
          loop={true}
          suffix="s"
          initialRepeatDelay={300} // Faster initial delay
          repeatInterval={80} // Faster repeat rate
        />
      </div>

      {/* Minutes without looping */}
      <div>
        <h3>Minutes (no looping)</h3>
        <PadNumeric
          label="Minutos"
          value={minutes}
          onChange={setMinutes}
          min={0}
          max={59}
          loop={false}
          suffix="m"
        />
      </div>

      {/* Hours with looping (1-12 for AM/PM) */}
      <div>
        <h3>Hours (1-12 AM/PM with looping)</h3>
        <PadNumeric
          label="Horas"
          value={hours}
          onChange={setHours}
          min={1}
          max={12}
          loop={true}
          suffix="h"
          initialRepeatDelay={600} // Slower initial delay
          repeatInterval={150} // Slower repeat rate
        />
      </div>

      {/* Display current values */}
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h4>Current Values:</h4>
        <p>
          Hours: {hours}h, Minutes: {minutes}m, Seconds: {seconds}s
        </p>
        <p>Total: {hours * 3600 + minutes * 60 + seconds} seconds</p>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        <h4>Usage Notes:</h4>
        <ul>
          <li>
            <strong>Click and hold</strong> the +/- buttons for key-repeat behavior
          </li>
          <li>
            <strong>Seconds</strong> loop from 59→0 and 0→59
          </li>
          <li>
            <strong>Hours</strong> loop from 12→1 and 1→12 (AM/PM style)
          </li>
          <li>
            <strong>Minutes</strong> stop at 0 and 59 (no looping)
          </li>
          <li>
            Timing is configurable via <code>initialRepeatDelay</code> and <code>repeatInterval</code> props
          </li>
        </ul>
      </div>
    </div>
  );
};
