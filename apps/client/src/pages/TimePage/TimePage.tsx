import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PadTimeGroup } from 'components/Pads/PadTimeGroup';
import { Box, Flex } from '@radix-ui/themes';
import { stylesAppContent } from '../../styles/project/project.app.styles';
import { TIME_DEFAULT_SECONDS, TIME_MAX_SECONDS, TIME_MIN_SECONDS } from 'constants/time.config';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { timePageState } from 'utils/timePageState';

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
    <Flex css={stylesAppContent} className="time-content" gap="3" direction="column">
      <Flex gap="3" justify="center">
        <Box>
          <PadTimeGroup
            value={totalSeconds}
            onChange={handleTimeChange}
            // description={t('app.components.temperatureControl.initial')}
            min={TIME_MIN_SECONDS}
            max={TIME_MAX_SECONDS}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
