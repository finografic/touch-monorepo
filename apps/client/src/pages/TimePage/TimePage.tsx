import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Flex } from '@radix-ui/themes';
import { PadNumeric } from 'components/Pads/PadNumeric';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useSession } from 'providers/SessionProvider/SessionContext';

import { timePageState } from 'utils/timePageState';

import { TIME_DEFAULT_SECONDS, TIME_MAX_SECONDS } from 'config/app';

export const TimePage = () => {
  const { t } = useTranslation();
  const { orders } = useOrders();
  const { currentSessionId } = useSession();
  const [totalSeconds, setTotalSeconds] = useState<number>(TIME_DEFAULT_SECONDS);

  // Initialize with default time
  useEffect(() => {
    setTotalSeconds(TIME_DEFAULT_SECONDS);
    timePageState.setTime(TIME_DEFAULT_SECONDS);
  }, []);

  // Get selected items from current session
  const selectedItems = useMemo(() => {
    if (!currentSessionId) return [];
    return orders.filter((order) => order.session?.id === currentSessionId && order.isSelected);
  }, [orders, currentSessionId]);

  const handleTimeChange = useCallback(
    (newTotalSeconds: number) => {
      setTotalSeconds(newTotalSeconds);
      timePageState.setTime(newTotalSeconds);
      console.log('TimePage: Time changed to', newTotalSeconds, 'seconds');
    },
    [setTotalSeconds],
  );

  return (
    <Flex className="time-content" gap="3" direction="column">
      <Flex gap="3" justify="center">
        <Box>
          <Flex gap="3" justify="center">
            <PadNumeric
              label="Minutos"
              value={Math.floor(totalSeconds / 60)}
              onChange={(minutes) => {
                const newTotalSeconds = minutes * 60 + (totalSeconds % 60);
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
              value={totalSeconds % 60}
              onChange={(seconds) => {
                const newTotalSeconds = Math.floor(totalSeconds / 60) * 60 + seconds;
                handleTimeChange(newTotalSeconds);
              }}
              min={0}
              max={59}
              step={1}
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
