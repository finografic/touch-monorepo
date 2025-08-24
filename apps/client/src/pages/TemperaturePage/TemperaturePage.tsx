import { useEffect, useMemo, useState } from 'react';
import type { Temperature } from 'types/orders.types';
import { Box, Flex } from '@radix-ui/themes';
import { stylesAppContent } from 'styles/custom/content.app.styles';
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
      <Flex direction="column" gap="3" justify="center" css={styles}>
        <Flex gap="3" justify="center" className="page-description">
          <Box>
            <p style={{ textAlign: 'center' }}>{TEMPERATURE_DESCRIPTIONS.page}</p>
            {closestProfile !== null && (
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
