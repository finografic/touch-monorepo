import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Col, Row } from 'react-grid-system';

import { Box, Flex, Text } from '@radix-ui/themes';
import { getRelaySlotType } from 'admin/utils/relays.utils';
import clsx from 'clsx';
import { SelectCustom } from 'forms/SelectCustom';
import { Button, type ButtonColor } from 'components/Button';

import { useBulkUpdateSlotConfigurations } from 'queries/slot-configurations';

import type { SelectOption } from 'types/models/select-option.model';
import { RELAY_SLOT_COLORS, type RelayConfig } from 'types/relays.types';
import { SlotSpecial, SlotType } from 'types/slots.types';
import { NUM_RELAYS } from '../relays.config';
import { useColors } from 'styles';
import { styles } from './RelayAssign.styles';

interface RelayAssignProps {
  configurations: RelayConfig[];
  onRelayToggle?: (slotNumber: number, newState: boolean) => void;
  isLoading?: boolean;
}

// Map: rowNumber (1-16) -> selectedValue (1-16 | undefined)
type Assignments = Record<number, number | undefined>;

export const RelayAssign: React.FC<RelayAssignProps> = ({
  configurations,
  onRelayToggle,
  isLoading = false,
}) => {
  const bulkUpdateMutation = useBulkUpdateSlotConfigurations();

  const relayConfigurations = useMemo(() => {
    return configurations
      .filter((config) => config.slotNumber <= NUM_RELAYS)
      .sort((a, b) => a.slotNumber - b.slotNumber);
  }, [configurations]);

  const slotTypeMap = useMemo(() => {
    if (!configurations) return new Map<number, SlotType>();
    return new Map(configurations.map((config) => [config.slotNumber, config.slotType]));
  }, [configurations]);

  // Each slot has a unique relay assignment (1-16 or undefined)
  // Null values from DB are converted to undefined for UI state
  // Memoize relayNumber map to prevent unnecessary updates when only isOn changes
  const relayNumberMap = useMemo(() => {
    const map = new Map<number, number | undefined>();
    configurations
      .filter((config) => config.slotNumber <= NUM_RELAYS)
      .forEach((config) => {
        map.set(config.slotNumber, config.relayNumber ?? undefined);
      });
    return map;
  }, [configurations]);

  const [assignments, setAssignments] = useState<Assignments>(() => {
    const initial: Assignments = {};
    relayNumberMap.forEach((relayNumber, slotNumber) => {
      initial[slotNumber] = relayNumber;
    });
    return initial;
  });

  // Use ref to track previous relayNumberMap to detect actual changes
  const prevRelayNumberMapRef = useRef<Map<number, number | undefined>>(relayNumberMap);

  useEffect(
    function synchronizeAssignments() {
      // Only update if relayNumber values actually changed (not just isOn)
      const hasChanged = Array.from(relayNumberMap.entries()).some(
        ([slotNumber, relayNumber]) => prevRelayNumberMapRef.current.get(slotNumber) !== relayNumber,
      );

      if (hasChanged) {
        const initial: Assignments = {};
        relayNumberMap.forEach((relayNumber, slotNumber) => {
          initial[slotNumber] = relayNumber;
        });
        setAssignments(initial);
        prevRelayNumberMapRef.current = relayNumberMap;
      }
    },
    [relayNumberMap],
  );

  const baseOptions: SelectOption[] = useMemo(() => {
    return Array.from({ length: NUM_RELAYS }, (_, index) => {
      const value = index + 1;
      return { value: value.toString(), label: `Relay ${value}` };
    });
  }, []);

  const updateAllConfigurations = useCallback(
    (newAssignments: Assignments) => {
      const updatedConfigs = configurations.map((config) => {
        // Check if slot is in newAssignments (even if value is undefined)
        const hasAssignment = config.slotNumber in newAssignments;
        const assignment = newAssignments[config.slotNumber];

        if (hasAssignment) {
          // Convert undefined back to null for DB
          return {
            slotNumber: config.slotNumber,
            slotType: config.slotType,
            isActive: config.isActive, // Preserve existing isActive
            relayNumber: assignment ?? null,
          };
        }

        return {
          slotNumber: config.slotNumber,
          slotType: config.slotType,
          isActive: config.isActive, // Preserve existing isActive
          relayNumber: config.relayNumber,
        };
      });

      bulkUpdateMutation.mutate({
        configurations: updatedConfigs,
      });
    },
    [configurations, bulkUpdateMutation],
  );

  const handleSelectChange = useCallback(
    (slotNumber: number, selectedValue: string) => {
      const relayValue = selectedValue ? Number(selectedValue) : undefined;
      const config = relayConfigurations.find((c) => c.slotNumber === slotNumber);
      if (!config) return;

      setAssignments((prev) => {
        const currentAssignment = prev[slotNumber];

        // Deselect if empty or clicking the same value (toggle behavior)
        if (!selectedValue || currentAssignment === relayValue) {
          const updated = { ...prev, [slotNumber]: undefined };
          updateAllConfigurations(updated);
          return updated;
        }

        // Find any conflicting slot that already has this relay assigned
        const conflictingSlotNumber = Object.keys(prev).find(
          (key) => Number(key) !== slotNumber && prev[Number(key)] === relayValue,
        );

        const updated: Assignments = { ...prev };

        // Swap: clear the conflict and assign to current slot
        if (conflictingSlotNumber) {
          updated[Number(conflictingSlotNumber)] = undefined;
        }
        updated[slotNumber] = relayValue;

        updateAllConfigurations(updated);
        return updated;
      });
    },
    [relayConfigurations, updateAllConfigurations],
  );

  const colors = useColors();

  const getSlotColor = (slotType: SlotType, isOn = false) => {
    // If relay is ON, use success color regardless of slot type
    if (isOn) {
      return 'success';
    }

    switch (slotType) {
      case SlotType.A:
        return colors.defaultLight;
      case SlotType.B:
        return colors.infoLight;
      case SlotType.C:
        return colors.dangerLight;
      default:
        return colors.defaultLight;
    }
  };

  const handleSlotClick = useCallback(
    (slotNumber: number) => {
      const currentConfig = relayConfigurations.find((config) => config.slotNumber === slotNumber);
      // Can only toggle if relay is assigned
      if (!currentConfig || !currentConfig.relayNumber) return;

      const newIsOn = !currentConfig.isOn;
      onRelayToggle?.(currentConfig.relayNumber, newIsOn);
    },
    [onRelayToggle, relayConfigurations],
  );

  const getRelaySlotColor = (slotType: SlotType | SlotSpecial) => {
    // switch (slotType) {
    // case SlotSpecial.ENF:
    //   return 'ENF';
    // case SlotSpecial.MTO:
    //   return 'MTO';

    switch (slotType) {
      case SlotType.A:
        return RELAY_SLOT_COLORS[SlotType.A];
      case SlotType.B:
        return RELAY_SLOT_COLORS[SlotType.B];
      case SlotType.C:
        return RELAY_SLOT_COLORS[SlotType.C];
      case SlotSpecial.ENF:
        return RELAY_SLOT_COLORS[SlotSpecial.ENF];
      case SlotSpecial.MTO:
        return RELAY_SLOT_COLORS[SlotSpecial.MTO];
      default:
        return RELAY_SLOT_COLORS[SlotType.A];
    }

    // default:
    // return slotType.toString() as ButtonColor;
    // }

    return RELAY_SLOT_COLORS[slotType] as ButtonColor;
  };

  return (
    <Box css={styles}>
      <div className="slot-list">
        {/* TODO: ORDER BY *SLOT NUMBER* */}
        {relayConfigurations.map((config) => {
          const configuredSlotType = slotTypeMap.get(config.slotNumber) || config.slotType;

          const COLOR = getRelaySlotColor(configuredSlotType);
          log('COLOR:', 'lime', COLOR);

          return (
            <div key={config.slotNumber} className={clsx('slot-grid-item', { 'is-loading': isLoading })}>
              <Row>
                <Col xs={1} className="col col-button">
                  <Button
                    className="slot-button"
                    onClick={() => handleSlotClick(config.slotNumber)}
                    disabled={isLoading}
                    variant="outline"
                    // color="primary"
                    color={getRelaySlotColor(configuredSlotType) as ButtonColor}
                    // color={getSlotColor(configuredSlotType, config.isOn) as ButtonColor}
                  >
                    <Flex direction="column" align="center" gap="1">
                      <Text
                        size="3"
                        weight="bold"
                        style={{ color: String(getSlotColor(configuredSlotType, config.isOn)) }}
                      >
                        {config.slotNumber}
                      </Text>
                    </Flex>
                  </Button>
                </Col>
                <Col xs={1} className="col col-type">
                  {getRelaySlotType(config, relayConfigurations)}
                </Col>
                <Col xs={5} className="col col-select">
                  <SelectCustom
                    className="relay-assign-select"
                    options={baseOptions}
                    placeholder="Please select..."
                    value={assignments[config.slotNumber]?.toString() || undefined}
                    onSelect={(value) => handleSelectChange(config.slotNumber, value)}
                    disabled={isLoading || bulkUpdateMutation.isPending}
                    allowEmpty={true}
                  />
                </Col>
                <Col xs={5} className="col col-status">
                  <Flex
                    align="center"
                    gap="2"
                    ml="3"
                    className={`relay-status ${config.isOn ? 'status-on' : 'status-off'}`}
                  >
                    <Flex className="relay-status-indicator">{config.slotNumber}</Flex>

                    <Flex justify="end">Relay</Flex>
                    <Flex justify="center">{config.slotNumber}:</Flex>
                    <Flex>{config.isOn ? 'ON' : 'OFF'}</Flex>
                  </Flex>
                </Col>
              </Row>
            </div>
          );
        })}
      </div>
    </Box>
  );
};

/*
// Memoize component to prevent re-renders when props haven't changed
// Custom comparison: only re-render if configurations array contents changed or other props changed
export const RelayAssign = memo(RelayAssignComponent, (prevProps, nextProps) => {
  // Compare configurations array - check if length or any item changed
  if (prevProps.configurations.length !== nextProps.configurations.length) {
    return false; // Re-render needed
  }

  // Deep compare each configuration item
  for (let i = 0; i < prevProps.configurations.length; i++) {
    const prev = prevProps.configurations[i];
    const next = nextProps.configurations[i];

    // Compare all relevant fields
    if (
      prev.id !== next.id ||
      prev.slotNumber !== next.slotNumber ||
      prev.slotType !== next.slotType ||
      prev.relayNumber !== next.relayNumber ||
      prev.isActive !== next.isActive ||
      prev.isOn !== next.isOn
    ) {
      return false; // Re-render needed
    }
  }

  // Compare other props
  if (prevProps.isLoading !== nextProps.isLoading) {
    return false; // Re-render needed
  }

  // onRelayToggle is a function - compare by reference (should be stable if memoized in parent)
  if (prevProps.onRelayToggle !== nextProps.onRelayToggle) {
    return false; // Re-render needed
  }

  // All props are equal - skip re-render
  return true;
});
*/
