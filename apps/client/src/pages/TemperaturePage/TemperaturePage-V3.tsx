import { useEffect, useMemo, useState } from 'react';
import type { Temperature } from 'types/orders.types';
import { Box, Flex } from '@radix-ui/themes';
import { stylesAppContent } from 'styles/project/project.app.styles';
import { INITIAL_TEMP_DEFAULT, MIN_TEMP_DIFFERENCE } from 'constants/temperature.config';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useFiltering } from 'hooks/useFiltering';
import { useFilters } from 'providers/FiltersProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { TemperatureKey } from 'types/temperature.types';
import { styles } from './TemperaturePage.styles';
import { findClosestProfile } from 'utils/temperature.utils';
import { ClosestTemperatures } from 'pages/TemperaturePage/ClosestTemperatures';
import { PadNumeric } from 'components/Pads/PadNumeric';
import { useTemperatureManagement } from './useTemperatureManagement';
import { TEMPERATURE_DESCRIPTIONS } from './temperature.constants';

const isVisibleClosestProfile = false;

interface TemperatureState {
  initial: number;
  final: number;
}

export const TemperaturePage = () => {
  const { profile, ordersReadable } = useOrders();
  const { dataFiltered } = useFiltering();
  const { filters, setFilter } = useFilters();
  const { currentSessionId, sessions, updateSessionFilters } = useSession();

  const [temperatures, setTemperatures] = useState<TemperatureState>({
    [TemperatureKey.Initial]: INITIAL_TEMP_DEFAULT,
    [TemperatureKey.Final]: INITIAL_TEMP_DEFAULT,
  });

  // Flag to prevent re-initialization after first load
  const [isInitialized, setIsInitialized] = useState(false);

  // Extract temperature profiles from the profile data (filtered order)
  // Fallback to first order if profile is not set (safety net for edge cases)
  const currentOrder = profile || ordersReadable[0];
  const temperatureProfiles = currentOrder?.temperatureProfiles ?? [];

  // Use custom hook for temperature management
  const { minProfileTemp, minMaxTemperatures, initializeTemperatures, updateTemperatures } =
    useTemperatureManagement({
      profiles: temperatureProfiles,
      dataFiltered,
    });

  // ======================================================================== //

  // Find the closest temperature profile for the current selection
  const closestProfile = useMemo(() => {
    if (!temperatureProfiles.length) return null;
    return findClosestProfile(temperatureProfiles, temperatures.initial, temperatures.final);
  }, [temperatureProfiles, temperatures.initial, temperatures.final]);

  // ======================================================================== //

  // Initialize temperatures from FiltersContext on page load (only once)
  useEffect(() => {
    if (isInitialized) return; // Prevent re-initialization

    const temperatureFilter = filters.temperature;
    if (
      temperatureFilter &&
      temperatureFilter.initial !== undefined &&
      temperatureFilter.final !== undefined
    ) {
      console.log('🎯 TEMPERATURE: Initializing from FiltersContext:', {
        initial: temperatureFilter.initial,
        final: temperatureFilter.final,
        closestTemperature: temperatureFilter.closestTemperature,
      });

      // Map the filter values to the correct temperature inputs
      // initial filter value (3) -> Final temperature input (03.0 °C)
      // final filter value (-4) -> Initial temperature input (25.0 °C from closestTemperature)
      setTemperatures({
        [TemperatureKey.Initial]: temperatureFilter.closestTemperature || temperatureFilter.final,
        [TemperatureKey.Final]: temperatureFilter.initial,
      });
      setIsInitialized(true);
    } else {
      // Fallback to the old initialization logic
      initializeTemperatures(setTemperatures);
      setIsInitialized(true);
    }
  }, [filters.temperature, initializeTemperatures, isInitialized]);

  // ======================================================================== //

  // Handle temperature changes
  const handleChange = (name: TemperatureKey, temp: Temperature) => {
    const update = { ...temperatures, [name]: temp.value };

    if (name === TemperatureKey.Initial) {
      // Adjust final temperature if initial is reduced
      const adjustedFinal = Math.min(update.final, update.initial - MIN_TEMP_DIFFERENCE);
      Object.assign(update, { [TemperatureKey.Final]: adjustedFinal });
    }

    updateTemperatures(update.initial, update.final, setTemperatures);

    // Update the temperature filter in FiltersContext when user changes values
    const temperatureFilter = filters.temperature;
    if (temperatureFilter) {
      const updatedTemperatureFilter = {
        ...temperatureFilter,
        initial: update.final, // Final temperature input -> initial filter value
        final: update.initial, // Initial temperature input -> final filter value
        closestTemperature: closestProfile?.temperature,
      };

      setFilter('temperature', updatedTemperatureFilter);

      console.log('🎯 TEMPERATURE: User changed temperature, updated filter:', {
        initial: update.initial,
        final: update.final,
        closestTemperature: closestProfile?.temperature,
      });
    }
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
            {TEMPERATURE_DESCRIPTIONS.page && (
              <p style={{ textAlign: 'center' }}>{TEMPERATURE_DESCRIPTIONS.page}</p>
            )}
            {isVisibleClosestProfile && closestProfile !== null && (
              <ClosestTemperatures closestProfile={closestProfile} profiles={temperatureProfiles} />
            )}
          </Box>
        </Flex>

        <Flex gap="3" justify="center">
          <PadNumeric
            label={TEMPERATURE_DESCRIPTIONS.initial.label}
            value={temperatures.initial}
            onChange={(value) => handleChange(TemperatureKey.Initial, { value, unit: '°C' })}
            min={minProfileTemp}
            max={minMaxTemperatures.max}
            step={0.5}
            decimalPlaces={1}
            padZeros={0}
            suffix="°C"
          />
          <PadNumeric
            label={TEMPERATURE_DESCRIPTIONS.final.label}
            value={temperatures.final}
            onChange={(value) => handleChange(TemperatureKey.Final, { value, unit: '°C' })}
            min={minMaxTemperatures.min}
            max={temperatures.initial - MIN_TEMP_DIFFERENCE}
            step={0.5}
            decimalPlaces={1}
            padZeros={0}
            suffix="°C"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
