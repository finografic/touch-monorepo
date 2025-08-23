import { useEffect, useMemo, useState } from 'react';
import type { Temperature } from 'types/orders.types';
import { Box, Flex } from '@radix-ui/themes';
import { stylesAppContent } from 'styles/custom/content.app.styles';
import {
  FINAL_TEMP_MIN,
  INITIAL_TEMP_DEFAULT,
  INITIAL_TEMP_MAX,
  MIN_TEMP_DIFFERENCE,
} from 'constants/temperature.config';
import { useGetMinMaxTemperatures } from 'queries/temperature/useGetMinMaxTemperatures';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useFilters } from 'hooks/useFilters';
import { TemperatureKey } from 'types/temperature.types';
import { styles } from './TemperaturePage.styles';
import { useGetTemperatureProfiles } from 'queries/temperature/useGetTemperatureProfiles';
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
  const { orders } = useOrders();
  const { dataFiltered } = useFilters();

  const [temperatures, setTemperatures] = useState<TemperatureState>({
    [TemperatureKey.Initial]: INITIAL_TEMP_DEFAULT,
    [TemperatureKey.Final]: INITIAL_TEMP_DEFAULT,
  });

  // Get min and max allowed temperatures
  const {
    data: minMaxTemperatures,
    isLoading: isLoadingTemperatures,
    error: minMaxError,
  } = useGetMinMaxTemperatures();

  // Fetch all temperature profiles for the current orderId
  const temperatureProfilesQuery = useGetTemperatureProfiles({
    orderId: orders[0]?.id,
    enabled: Boolean(orders[0]?.id),
  });

  const profiles = temperatureProfilesQuery.data ?? [];
  const isLoadingProfiles = temperatureProfilesQuery.isLoading;
  const profilesError = temperatureProfilesQuery.error;

  // Use custom hook for temperature management
  const { minProfileTemp, initializeTemperatures, updateTemperatures, isInitialized } =
    useTemperatureManagement({
      orders,
      profiles,
      dataFiltered,
    });

  // Find the closest temperature profile for the current selection
  const closestProfile = useMemo(() => {
    if (!profiles.length) return null;
    return findClosestProfile(profiles, temperatures.initial, temperatures.final);
  }, [profiles, temperatures.initial, temperatures.final]);

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

  // Don't show inputs until we have the temperature constraints and default values
  if ((isLoadingTemperatures && !minMaxError) || isLoadingProfiles || !isInitialized) {
    return (
      <Flex css={stylesAppContent} className="temperature-content" gap="3" direction="column">
        <Box>Loading temperature settings...</Box>
      </Flex>
    );
  }

  if (profilesError) {
    return (
      <Flex css={stylesAppContent} className="temperature-content" gap="3" direction="column">
        <Box>Error loading temperature profiles.</Box>
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
              <ClosestTemperatures closestProfile={closestProfile} profiles={profiles} />
            )}
          </Box>
        </Flex>

        <TemperatureForm
          temperatures={temperatures}
          onChange={handleChange}
          minProfileTemp={minProfileTemp}
          maxInitialTemp={minMaxTemperatures?.max ?? INITIAL_TEMP_MAX}
          minFinalTemp={minMaxTemperatures?.min ?? FINAL_TEMP_MIN}
          labels={{
            initial: TEMPERATURE_DESCRIPTIONS.initial.label,
            final: TEMPERATURE_DESCRIPTIONS.final.label,
          }}
        />
      </Flex>
    </Flex>
  );
};
