import { useCallback, useEffect } from 'react';

import { Box, Flex } from '@radix-ui/themes';
import { PadNumeric } from 'components/Pads/PadNumeric';

import { useTimePageStore } from './useTimePageStore';
import { TIME_MAX_SECONDS } from 'config/app';

export const TimePage = () => {
  // ✅ Use proper Zustand store instead of local state
  const { timeSeconds, setTime, resetTime } = useTimePageStore();

  // Initialize with default time
  useEffect(() => {
    resetTime();
  }, [resetTime]);

  const handleTimeChange = useCallback(
    (newTotalSeconds: number) => {
      setTime(newTotalSeconds);
    },
    [setTime],
  );

  return (
    <Flex className="time-content" gap="3" direction="column">
      <Flex gap="3" justify="center">
        <Box>
          <Flex gap="3" justify="center">
            <PadNumeric
              label="Minutos"
              value={Math.floor(timeSeconds / 60)}
              onChange={(minutes) => {
                const newTotalSeconds = minutes * 60 + (timeSeconds % 60);
                handleTimeChange(newTotalSeconds);
              }}
              min={0}
              max={Math.floor(TIME_MAX_SECONDS / 60)}
              step={1}
              padZeros={2}
              suffix="Min"
            />
            <PadNumeric
              label="Segundos"
              value={timeSeconds % 60}
              onChange={(seconds) => {
                const newTotalSeconds = Math.floor(timeSeconds / 60) * 60 + seconds;
                handleTimeChange(newTotalSeconds);
              }}
              min={0}
              max={59}
              step={5}
              padZeros={2}
              suffix="Seg"
              loop={true}
            />
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};
