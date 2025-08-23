import type { TemperatureProfile } from 'types/temperature.types';

export const ClosestTemperatures = ({
  closestProfile,
  profiles,
}: {
  closestProfile: TemperatureProfile;
  profiles: TemperatureProfile[];
}) => {
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
