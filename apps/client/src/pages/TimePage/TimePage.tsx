import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TimeInputGroup } from 'src/forms/TimeInput/TimeInputGroup';
import { Box, Flex } from '@radix-ui/themes';
import { stylesAppContent } from '../../styles/custom/content.app.styles';
import { TIME_DEFAULT_SECONDS, TIME_MAX_SECONDS, TIME_MIN_SECONDS } from 'constants/time.config';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useSession } from 'providers/SessionProvider/SessionContext';

export const TimePage = () => {
  const { t } = useTranslation();
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

  // TODO: temporal debugging
  // log('__DEV: ITEMS:', 'grey', selectedItems);

  return (
    <Flex css={stylesAppContent} className="time-content" gap="3" direction="column">
      <Flex className="page-description" gap="3" justify="center">
        <Box>
          <p>
            {t('app.orders.active')}: {selectedItems.length}
          </p>
        </Box>
      </Flex>

      <Flex gap="3" justify="center">
        <Box>
          <TimeInputGroup
            value={totalSeconds}
            onChange={handleTimeChange}
            description={t('app.components.temperatureControl.initial')}
            min={TIME_MIN_SECONDS}
            max={TIME_MAX_SECONDS}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
