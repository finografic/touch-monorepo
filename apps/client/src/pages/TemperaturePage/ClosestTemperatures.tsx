import { useMemo } from 'react';

import type { TemperatureState } from 'pages/TemperaturePage/TemperaturePage.types';

import { findClosestProfile } from 'utils/temperature.utils';

import type { TemperatureProfile } from 'types/temperature.types';

export const ClosestTemperatures = ({
  temperatures,
  profiles,
}: {
  temperatures: TemperatureState;
  profiles: TemperatureProfile[];
}) => {
  // Find the closest temperature profile for the current selection
  const closestProfile = useMemo((): TemperatureProfile | null => {
    if (!profiles.length) return null;
    return findClosestProfile(profiles, temperatures.initial, temperatures.final);
  }, [profiles, temperatures.initial, temperatures.final]);

  if (!closestProfile) {
    return null;
  }

  return (
    <>
      <div style={{ color: 'orange', marginTop: 8, textAlign: 'center' }}>
        Closest available profile: {closestProfile.temperature}°C
      </div>
      <div
        style={{
          color: 'orange',
          opacity: 0.6,
          marginTop: 4,
          textAlign: 'center',
          fontSize: '0.7em',
        }}
      >
        Available profiles: [
        {profiles.map((p, i) => (
          <span key={p.id}>
            {p.temperature}
            {i < profiles.length - 1 ? ', ' : ''}
          </span>
        ))}
        ]
      </div>
    </>
  );
};
