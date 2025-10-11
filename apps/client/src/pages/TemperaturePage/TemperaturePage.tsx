import { useEffect, useMemo, useState } from 'react';
import type { Temperature } from 'types/orders.types';
import { Box, Flex } from '@radix-ui/themes';
// import { stylesAppContent } from 'styles/project/project.app.styles';
import { INITIAL_TEMP_DEFAULT, MIN_TEMP_DIFFERENCE } from 'config/app';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { TemperatureKey } from 'types/temperature.types';
import { ClosestTemperatures } from 'pages/TemperaturePage/ClosestTemperatures';
import { PadNumeric } from 'components/Pads/PadNumeric';
import { useTemperatureFormAndFilter } from './useTemperatureFormAndFilter';
import { TEMPERATURE_DESCRIPTIONS } from './temperature.constants';
import type { TemperatureState } from 'pages/TemperaturePage/TemperaturePage.types';
import { useFilters } from 'providers/FiltersProvider/useFilters';
import { styles } from './TemperaturePage.styles';
import { useDirtyFixFallback } from 'hooks/useDirtyFixFallback';

const isVisibleClosestProfile = false;

export const TemperaturePage = () => {
  const { profile, ordersReadable } = useOrders();
  const { dataFiltered } = useFilters();
  const { createFallbackEntry } = useDirtyFixFallback();

  const [temperatures, setTemperatures] = useState<TemperatureState>({
    [TemperatureKey.Initial]: INITIAL_TEMP_DEFAULT,
    [TemperatureKey.Final]: INITIAL_TEMP_DEFAULT,
  });

  // 🚨 DIRTY FIX: Use fallback entry if no data available
  const currentOrder = useMemo(() => {
    if (profile) return profile;
    if (ordersReadable[0]) return ordersReadable[0];

    // Use the shared dirty fix hook
    return createFallbackEntry;
  }, [profile, ordersReadable, createFallbackEntry]);

  const temperatureProfiles = currentOrder?.temperatureProfiles ?? [];

  const { minProfileTemp, minMaxTemperatures, initializeTemperatures, updateTemperatures } =
    useTemperatureFormAndFilter({
      profiles: temperatureProfiles,
      dataFiltered,
    });

  useEffect(
    function initializePage() {
      initializeTemperatures(setTemperatures);
    },
    [initializeTemperatures],
  );

  const handleChange = (name: TemperatureKey, temp: Temperature) => {
    const update = { ...temperatures, [name]: temp.value };

    if (name === TemperatureKey.Initial) {
      // Adjust final temperature if initial is reduced
      const adjustedFinal = Math.min(update.final, update.initial - MIN_TEMP_DIFFERENCE);
      Object.assign(update, { [TemperatureKey.Final]: adjustedFinal });
    }

    updateTemperatures(update.initial, update.final, setTemperatures);
  };

  if (!currentOrder || !temperatureProfiles.length) {
    return (
      <Flex
        // css={stylesAppContent}
        className="temperature-content"
        gap="3"
        direction="column"
      >
        <Box style={{ background: 'white', padding: '15px' }}>
          <div>Loading temperature settings...</div>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex
      //  css={stylesAppContent}
      className="temperature-content"
      gap="3"
      direction="column"
    >
      <Flex direction="column" gap="3" justify="center" css={styles}>
        <Flex gap="3" justify="center" className="page-description">
          <Box>
            {TEMPERATURE_DESCRIPTIONS.page && (
              <p style={{ textAlign: 'center' }}>{TEMPERATURE_DESCRIPTIONS.page}</p>
            )}
            {isVisibleClosestProfile && (
              <ClosestTemperatures temperatures={temperatures} profiles={temperatureProfiles} />
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
