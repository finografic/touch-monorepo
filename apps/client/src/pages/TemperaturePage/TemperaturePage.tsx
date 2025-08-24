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

  // Debug logging
  console.log('🔍 TemperaturePage Debug:', {
    ordersReadableLength: ordersReadable?.length,
    profileExists: !!profile,
    profileId: profile?.id,
    currentOrder: currentOrder?.id,
    temperatureProfilesLength: temperatureProfiles?.length,
    temperatureProfiles,
    dataFilteredLength: dataFiltered?.length,
  });

  // Debug the actual currentOrder structure
  console.log('🔍 CurrentOrder Structure:', {
    currentOrderKeys: currentOrder ? Object.keys(currentOrder) : 'NO_ORDER',
    currentOrderFull: currentOrder,
    hasTemperatureProfiles: 'temperatureProfiles' in (currentOrder || {}),
    temperatureProfilesType: typeof currentOrder?.temperatureProfiles,
    timeRowsType: typeof currentOrder?.timeRows,
    profileSource: profile ? 'PROFILE' : 'ORDERS_READABLE[0]',
    profileId: profile?.id,
    ordersReadableFirstId: ordersReadable[0]?.id,
  });

  // Debug all available data sources
  console.log('🔍 All Available Data Sources:', {
    ordersReadableSample: ordersReadable.slice(0, 2), // First 2 orders
    dataFilteredSample: dataFiltered?.slice(0, 2), // First 2 filtered items
    ordersReadableKeys: ordersReadable[0] ? Object.keys(ordersReadable[0]) : 'NO_ORDERS',
    dataFilteredKeys: dataFiltered?.[0] ? Object.keys(dataFiltered[0]) : 'NO_FILTERED_DATA',
  });

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
    console.log('🔍 useEffect - initializeTemperatures called');
    initializeTemperatures(setTemperatures);
  }, []); // Remove initializeTemperatures dependency to prevent infinite loops

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

  // Debug loading state
  console.log('🔍 Loading State Check:', {
    hasCurrentOrder: !!currentOrder,
    hasTemperatureProfiles: !!temperatureProfiles.length,
    shouldShowLoading: !currentOrder || !temperatureProfiles.length,
  });

  // Don't show inputs until we have the order data and temperature profiles
  if (!currentOrder || !temperatureProfiles.length) {
    return (
      <Flex css={stylesAppContent} className="temperature-content" gap="3" direction="column">
        <Box style={{ background: 'white', padding: '15px' }}>
          <div>Loading temperature settings...</div>
          <div>Debug: currentOrder={currentOrder ? 'YES' : 'NO'}</div>
          <div>Debug: temperatureProfiles={temperatureProfiles.length}</div>
          <div>Debug: Current Order ID: {currentOrder?.id || 'NONE'}</div>
          <div>Debug: Order Keys: {currentOrder ? Object.keys(currentOrder).join(', ') : 'NONE'}</div>
          <div>
            Debug: Has temperatureProfiles: {'temperatureProfiles' in (currentOrder || {}) ? 'YES' : 'NO'}
          </div>
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

        {/* Debug TemperatureForm props */}
        <Box style={{ fontSize: '12px', color: 'gray', textAlign: 'center', marginTop: '10px' }}>
          <div>Debug TemperatureForm Props:</div>
          <div>temperatures: {JSON.stringify(temperatures)}</div>
          <div>minProfileTemp: {minProfileTemp}</div>
          <div>maxInitialTemp: {minMaxTemperatures.max}</div>
          <div>minFinalTemp: {minMaxTemperatures.min}</div>
        </Box>
      </Flex>
    </Flex>
  );
};
