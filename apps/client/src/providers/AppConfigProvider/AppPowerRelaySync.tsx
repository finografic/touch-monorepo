import { useEffect, useRef } from 'react';
import { useAppConfig } from './AppConfigContext';
import { useGetSlotConfigurations } from 'queries/slot-configurations';
import { useToggleRelay } from 'queries/relays';
import { POWER_SLOT_NUMBER } from 'admin/config/admin.slots.config';

export const AppPowerRelaySync = () => {
  const { isPowerEnabled } = useAppConfig();
  const { data: slotConfigurations, isLoading } = useGetSlotConfigurations();
  const toggleRelayMutation = useToggleRelay();

  // Track previous state to avoid unnecessary API calls
  const prevPowerStateRef = useRef<boolean | null>(null);
  const hasInitializedRef = useRef(false);

  // Find PORWER Slt configuration to get its relay number
  const powerSlotConfig = slotConfigurations?.find((config) => config.slotNumber === POWER_SLOT_NUMBER);
  const relayNumber = powerSlotConfig?.relayNumber;

  useEffect(
    function syncPowerRelay() {
      if (isLoading || !slotConfigurations) {
        return;
      }

      if (!relayNumber) {
        return;
      }

      // Skip if this is the first render and state hasn't changed
      if (!hasInitializedRef.current) {
        hasInitializedRef.current = true;
        prevPowerStateRef.current = isPowerEnabled;

        // Set initial relay state based on current isPowerEnabled
        toggleRelayMutation.mutate({
          slotNumber: relayNumber,
          state: isPowerEnabled,
        });
        return;
      }

      // Only toggle if state actually changed
      if (prevPowerStateRef.current !== isPowerEnabled) {
        prevPowerStateRef.current = isPowerEnabled;

        toggleRelayMutation.mutate({
          slotNumber: relayNumber,
          state: isPowerEnabled,
        });
      }
    },
    [isPowerEnabled, relayNumber, toggleRelayMutation, isLoading, slotConfigurations],
  );

  return null;
};
