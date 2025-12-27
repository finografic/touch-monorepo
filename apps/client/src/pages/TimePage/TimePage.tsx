import { useCallback, useEffect } from 'react';

import { Box, Flex } from '@radix-ui/themes';
import { PadNumeric } from 'components/Pads/PadNumeric';

import { useTimePageStore } from './useTimePageStore';
import { TIME_MAX_SECONDS } from 'config/app';
import { useTranslation } from 'react-i18next';

export const TimePage = () => {
  const { t } = useTranslation();
  const { timeSeconds, setTime, resetTime } = useTimePageStore();

  useEffect(
    function initializeTimeValues() {
      resetTime();
    },
    [resetTime],
  );

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
              value={Math.floor(timeSeconds / 60)}
              onChange={(minutes) => {
                const newTotalSeconds = minutes * 60 + (timeSeconds % 60);
                setTime(newTotalSeconds);
              }}
              min={0}
              max={Math.floor(TIME_MAX_SECONDS / 60)}
              step={1}
              padZeros={2}
              suffix={t('ui.time.minutes')}
            />
            <PadNumeric
              value={timeSeconds % 60}
              onChange={(seconds) => {
                const newTotalSeconds = Math.floor(timeSeconds / 60) * 60 + seconds;
                handleTimeChange(newTotalSeconds);
              }}
              min={0}
              max={59}
              step={5}
              padZeros={2}
              suffix={t('ui.time.seconds')}
              loop={true}
            />
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};
