import { Box, Flex } from '@radix-ui/themes';
import { PadTemperature } from 'components/Pads/PadTemperature/PadTemperature';

import type { Temperature } from 'types/orders.types';
import { TemperatureKey } from 'types/temperature.types';
import { MIN_TEMP_DIFFERENCE } from 'config/app';
import { styles } from './TemperaturePage.styles';

interface TemperatureFormProps {
  temperatures: {
    initial: number;
    final: number;
  };
  onChange: (name: TemperatureKey, temp: Temperature) => void;
  minProfileTemp: number;
  maxInitialTemp: number;
  minFinalTemp: number;
  labels: {
    initial: string;
    final: string;
  };
}

export const TemperatureForm = ({
  temperatures,
  onChange,
  minProfileTemp,
  maxInitialTemp,
  minFinalTemp,
  labels,
}: TemperatureFormProps) => {
  return (
    <Flex gap="3" justify="center" className="temperature-content">
      <Box>
        <PadTemperature
          name={TemperatureKey.Initial}
          value={temperatures.initial}
          onChange={onChange}
          label={labels.initial}
          min={minProfileTemp}
          max={maxInitialTemp}
          step={0.5}
        />
      </Box>
      <Box>
        <PadTemperature
          name={TemperatureKey.Final}
          value={temperatures.final}
          onChange={onChange}
          label={labels.final}
          min={minFinalTemp}
          max={temperatures.initial - MIN_TEMP_DIFFERENCE}
          step={0.5}
        />
      </Box>
    </Flex>
  );
};
