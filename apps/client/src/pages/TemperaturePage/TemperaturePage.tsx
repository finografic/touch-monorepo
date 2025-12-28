import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Flex } from '@radix-ui/themes';
import { PadNumeric } from 'components/Pads/PadNumeric';
import { ClosestTemperatures } from 'pages/TemperaturePage/ClosestTemperatures';
import type { TemperatureState } from 'pages/TemperaturePage/TemperaturePage.types';

import { useSmartFallback } from 'hooks/useSmartFallback';
import { useFilters } from 'providers/FiltersProvider/useFilters';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';

import type { Temperature } from 'types/slots.types';
import { TemperatureKey } from 'types/temperature.types';
import { INITIAL_TEMP_DEFAULT, MIN_TEMP_DIFFERENCE } from 'config/app';
import { useTemperatureFormAndFilter } from './useTemperatureFormAndFilter';
import { styles } from './TemperaturePage.styles';

const isVisibleClosestProfile = false;

export const TemperaturePage = () => {
  const { t } = useTranslation();
  const { profile, ordersReadable } = useOrders();
  const { dataFiltered } = useFilters();
  const { createFallbackEntry } = useSmartFallback();

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
      <Flex className="temperature-content" gap="3" direction="column">
        <Box style={{ background: 'white', padding: '15px' }}>
          <div>Loading temperature settings...</div>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex className="temperature-content" gap="3" direction="column">
      <Flex direction="column" gap="3" justify="center" css={styles}>
        <Flex gap="3" justify="center" className="page-description">
          <Box>
            {isVisibleClosestProfile && (
              <ClosestTemperatures temperatures={temperatures} profiles={temperatureProfiles} />
            )}
          </Box>
        </Flex>

        <Flex gap="3" justify="center">
          <PadNumeric
            label={t('app.pages.temperature.labels.initial')}
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
            label={t('app.pages.temperature.labels.final')}
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
