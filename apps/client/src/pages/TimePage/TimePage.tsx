import { useCallback, useEffect, useMemo, useState } from 'react';
import { TimeInputGroup } from 'components/TimeInput/TimeInputGroup';
import { Box, Flex } from '@radix-ui/themes';
import { styles } from '../content.styles';
import { TIME_DEFAULT_SECONDS, TIME_MAX_SECONDS, TIME_MIN_SECONDS } from 'constants/time.config';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useSession } from 'providers/SessionProvider/SessionContext';

const DESCRIPTIONS = {
  page: 'Set the preparation time by specifying minutes and seconds. This time will be applied to all selected slots when you start.',
} as const;

export const TimePage = () => {
  const { orders } = useOrders();
  const { currentSessionId } = useSession();

  const [totalSeconds, setTotalSeconds] = useState<number>(TIME_DEFAULT_SECONDS);

  // Get selected items from current session
  const selectedItems = useMemo(() => {
    if (!currentSessionId) return [];
    return orders.filter((order) => order.configurationSessionId === currentSessionId && order.isSelected);
  }, [orders, currentSessionId]);

  const handleTimeChange = useCallback((newTotalSeconds: number) => {
    setTotalSeconds(newTotalSeconds);
  }, []);

  log('__DEV: ITEMS:', 'grey', selectedItems);

  return (
    <Flex css={styles} className="time-content" gap="3" direction="column">
      <Flex className="page-description" gap="3" justify="center">
        <Box>
          <p>Selected items: {selectedItems.length}</p>
        </Box>
      </Flex>

      <Flex gap="3" justify="center">
        <Box>
          <TimeInputGroup
            value={totalSeconds}
            onChange={handleTimeChange}
            description={DESCRIPTIONS.page}
            min={TIME_MIN_SECONDS}
            max={TIME_MAX_SECONDS}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
