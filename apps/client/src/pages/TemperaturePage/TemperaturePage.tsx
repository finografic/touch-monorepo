import { useEffect, useMemo, useState } from 'react';
import type { Temperature } from 'types/orders.types';
import { Box, Flex } from '@radix-ui/themes';
import { stylesAppContent } from 'styles/project/project.app.styles';
import { INITIAL_TEMP_DEFAULT, MIN_TEMP_DIFFERENCE } from 'constants/temperature.config';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useFilters } from 'hooks/useFilters';
import { TemperatureKey } from 'types/temperature.types';
import { styles } from './TemperaturePage.styles';
import { findClosestProfile } from 'utils/temperature.utils';
import { ClosestTemperatures } from 'pages/TemperaturePage/ClosestTemperatures';
import { TemperatureForm } from './TemperatureForm';
import { useTemperatureManagement } from './useTemperatureManagement';
import { TEMPERATURE_DESCRIPTIONS } from './temperature.constants';

const isVisibleClosestProfile = false;

interface TemperatureState {
  initial: number;
  final: number;
}

export const TemperaturePage = () => {
  const { ordersReadable, profile } = useOrders();
  const { dataFiltered } = useFilters();

  const [temperatures, setTemperatures] = useState<TemperatureState>({
    [TemperatureKey.Initial]: INITIAL_TEMP_DEFAULT,
    [TemperatureKey.Final]: INITIAL_TEMP_DEFAULT,
  });

  // Extract temperature profiles from the profile data (filtered order)
  const currentOrder = profile || ordersReadable[0];
  const temperatureProfiles = currentOrder?.temperatureProfiles ?? [];

  // Use custom hook for temperature management
  const { minProfileTemp, minMaxTemperatures, initializeTemperatures, updateTemperatures } =
    useTemperatureManagement({
      profiles: temperatureProfiles,
      dataFiltered,
    });

  // Find the closest temperature profile for the current selection
  const closestProfile = useMemo(() => {
    if (!temperatureProfiles.length) return null;
    return findClosestProfile(temperatureProfiles, temperatures.initial, temperatures.final);
  }, [temperatureProfiles, temperatures.initial, temperatures.final]);

  // Initialize temperatures
  useEffect(() => {
    initializeTemperatures(setTemperatures);
  }, [initializeTemperatures]);

  // Handle temperature changes
  const handleChange = (name: TemperatureKey, temp: Temperature) => {
    const update = { ...temperatures, [name]: temp.value };

    if (name === TemperatureKey.Initial) {
      // Adjust final temperature if initial is reduced
      const adjustedFinal = Math.min(update.final, update.initial - MIN_TEMP_DIFFERENCE);
      Object.assign(update, { [TemperatureKey.Final]: adjustedFinal });
    }

    updateTemperatures(update.initial, update.final, setTemperatures);
  };

  // Don't show inputs until we have the order data and temperature profiles
  if (!currentOrder || !temperatureProfiles.length) {
    return (
      <Flex css={stylesAppContent} className="temperature-content" gap="3" direction="column">
        <Box style={{ background: 'white', padding: '15px' }}>
          <div>Loading temperature settings...</div>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex css={stylesAppContent} className="temperature-content" gap="3" direction="column">
      {/* 🔍 DEBUG: On-screen data dump */}
      <Box
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          fontSize: '12px',
          zIndex: 9999,
          pointerEvents: 'none',
          maxWidth: '400px',
          maxHeight: '300px',
          overflow: 'auto',
        }}
      >
        <div>
          <strong>🔍 TEMPERATURE PAGE DEBUG</strong>
        </div>
        <div>currentOrder: {currentOrder ? 'YES' : 'NO'}</div>
        <div>currentOrder.id: {currentOrder?.id || 'NONE'}</div>
        <div>temperatureProfiles.length: {temperatureProfiles.length}</div>
        <div>temperatures: {JSON.stringify(temperatures)}</div>
        <div>closestProfile: {closestProfile ? `${closestProfile.temperature}°C` : 'NONE'}</div>
        <div>minProfileTemp: {minProfileTemp}</div>
        <div>minMaxTemperatures: {JSON.stringify(minMaxTemperatures)}</div>
        <div>dataFiltered.length: {dataFiltered.length}</div>
        <div>ordersReadable.length: {ordersReadable.length}</div>
        <div>profile: {profile ? 'YES' : 'NO'}</div>
        <div>profile.id: {profile?.id || 'NONE'}</div>
      </Box>

      <Flex direction="column" gap="3" justify="center" css={styles}>
        <Flex gap="3" justify="center" className="page-description">
          <Box>
            {TEMPERATURE_DESCRIPTIONS.page && (
              <p style={{ textAlign: 'center' }}>{TEMPERATURE_DESCRIPTIONS.page}</p>
            )}
            {isVisibleClosestProfile && closestProfile !== null && (
              <ClosestTemperatures closestProfile={closestProfile} profiles={temperatureProfiles} />
            )}
          </Box>
        </Flex>

        <TemperatureForm
          temperatures={temperatures}
          onChange={handleChange}
          minProfileTemp={minProfileTemp}
          maxInitialTemp={minMaxTemperatures.max}
          minFinalTemp={minMaxTemperatures.min}
          labels={{
            initial: TEMPERATURE_DESCRIPTIONS.initial.label,
            final: TEMPERATURE_DESCRIPTIONS.final.label,
          }}
        />
      </Flex>
    </Flex>
  );
};
