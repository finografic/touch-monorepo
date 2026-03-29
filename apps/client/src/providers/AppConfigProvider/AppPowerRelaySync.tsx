import { useEffect, useRef } from 'react';

import { POWER_SLOT_NUMBER } from 'admin/config/admin.slots.config';

import { useToggleRelay } from 'queries/relays';
import { useGetSlotConfigurations } from 'queries/slot-configurations';

import { useAppConfig } from './AppConfigContext';

export const AppPowerRelaySync = () => {
  const { isPowerEnabled } = useAppConfig();
  const { data: slotConfigurations, isLoading } = useGetSlotConfigurations();
  const { mutate: toggleRelay } = useToggleRelay();

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
        toggleRelay({
          slotNumber: relayNumber,
          state: isPowerEnabled,
        });
        return;
      }

      // Only toggle if state actually changed
      if (prevPowerStateRef.current !== isPowerEnabled) {
        prevPowerStateRef.current = isPowerEnabled;

        toggleRelay({
          slotNumber: relayNumber,
          state: isPowerEnabled,
        });
      }
    },
    [isPowerEnabled, relayNumber, toggleRelay, isLoading, slotConfigurations],
  );

  return null;
};
