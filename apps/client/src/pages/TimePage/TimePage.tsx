import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PadTimeGroup } from 'components/Pads/PadTimeGroup';
import { Box, Flex } from '@radix-ui/themes';
import { stylesAppContent } from '../../styles/custom/content.app.styles';
import { TIME_DEFAULT_SECONDS, TIME_MAX_SECONDS, TIME_MIN_SECONDS } from 'constants/time.config';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useButtonOperations } from 'hooks/useButtonOperations';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'routes/routes.config';

export const TimePage = () => {
  const { t } = useTranslation();
  const { orders } = useOrders();
  const { currentSessionId } = useSession();
  const { handleStartTimeProcess } = useButtonOperations();
  const navigate = useNavigate();

  const [totalSeconds, setTotalSeconds] = useState<number>(TIME_DEFAULT_SECONDS);

  // Initialize with default time
  useEffect(() => {
    setTotalSeconds(TIME_DEFAULT_SECONDS);
  }, []);

  // Get selected items from current session
  const selectedItems = useMemo(() => {
    if (!currentSessionId) return [];
    return orders.filter((order) => order.session?.id === currentSessionId && order.isSelected);
  }, [orders, currentSessionId]);

  const handleTimeChange = useCallback(
    (newTotalSeconds: number) => {
      setTotalSeconds(newTotalSeconds);
    },
    [setTotalSeconds],
  );

  const handleStart = useCallback(() => {
    console.log('TimePage: Starting process with duration:', totalSeconds);
    handleStartTimeProcess(totalSeconds);
  }, [totalSeconds, handleStartTimeProcess]);

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
          <PadTimeGroup
            value={totalSeconds}
            onChange={handleTimeChange}
            description={t('app.components.temperatureControl.initial')}
            min={TIME_MIN_SECONDS}
            max={TIME_MAX_SECONDS}
          />
        </Box>
      </Flex>

      <Flex gap="3" justify="center">
        <Box>
          <button
            onClick={handleStart}
            style={{
              padding: '12px 24px',
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            {t('ui.buttons.start')} ({Math.floor(totalSeconds / 60)}:
            {(totalSeconds % 60).toString().padStart(2, '0')})
          </button>
        </Box>
      </Flex>
    </Flex>
  );
};
