import React from 'react';
import { Col, Row } from '@finografic/design-system/grid';
import { RadioIcon } from '@finografic/icons';

import { getRelaySlotType } from 'admin/utils/relays.utils';
import clsx from 'clsx';
import { SelectCustom } from 'forms/SelectCustom';
import { Flex } from 'styled-system/jsx';
import { Button } from '@finografic/design-system/components';

import { getSlotColor } from 'utils/slots.utils';
import type { SelectOption } from 'types/models/select-option.model';
import type { RelayConfig } from 'types/relays.types';
import type { SlotType } from 'types/slots.types';
import { AdminSlotTimer } from './AdminSlotTimer';

type Assignments = Record<number, number | undefined>;

interface RelaySlotRowProps {
  config: RelayConfig;
  relayConfigurations: RelayConfig[];
  slotTypeMap: Map<number, SlotType>;
  assignments: Assignments;
  baseOptions: SelectOption[];
  isRelayActive: boolean;
  isRelayFunctionalityEnabled: boolean;
  canTest: boolean;
  testingRelays: Set<number>;
  isLoading: boolean;
  isBulkUpdatePending: boolean;
  onSelectChange: (slotNumber: number, value: string) => void;
  onRelayTest: (relayNumber: number | null, slotNumber: number) => void;
  isRelayControlledByTimer: (relayNumber: number | null, slotNumber: number) => boolean;
}

export const RelaySlotRow: React.FC<RelaySlotRowProps> = ({
  config,
  relayConfigurations,
  slotTypeMap,
  assignments,
  baseOptions,
  isRelayActive,
  isRelayFunctionalityEnabled,
  canTest,
  testingRelays,
  isLoading,
  isBulkUpdatePending,
  onSelectChange,
  onRelayTest,
  isRelayControlledByTimer,
}) => {
  const assignment = assignments[config.slotNumber];

  const slotType = getRelaySlotType(config, relayConfigurations);

  return (
    <div
      className={clsx('slot-grid-item', `slot-type-${slotType.toLowerCase()}`, {
        'is-loading': isLoading,
      })}
    >
      <Row>
        <Col xs={2} className="col col-square-type">
          <Flex gap={4}>
            <Flex
              className="slot-square"
              style={{
                borderColor: getSlotColor(config),
                color: getSlotColor(config),
              }}
            >
              {config.slotNumber}
            </Flex>
            <Flex className="col col-type" style={{ color: getSlotColor(config) }}>
              {slotType}
            </Flex>
          </Flex>
        </Col>
        <Col xs={2} className="col col-timer">
          <Flex>
            <AdminSlotTimer slotNumber={config.slotNumber} />
          </Flex>
        </Col>
        <Col xs={4} className="col col-select">
          <Flex gap={6}>
            <Flex width="220px">
              <SelectCustom
                className="relay-assign-select"
                options={baseOptions}
                placeholder="Please select..."
                value={assignment?.toString() ?? undefined}
                onSelect={(value) => onSelectChange(config.slotNumber, value)}
                disabled={isLoading || isBulkUpdatePending}
                allowEmpty={true}
              />
            </Flex>
            <Flex>
              {assignment != null ? (
                <Button
                  className={clsx('button-relay-test', {
                    active: testingRelays.has(config.relayNumber ?? 0),
                  })}
                  onClick={() => onRelayTest(config.relayNumber, config.slotNumber)}
                  variant="solid"
                  palette="success"
                  size="sm"
                  disabled={!canTest || isRelayControlledByTimer(config.relayNumber, config.slotNumber)}
                >
                  <RadioIcon /> test
                </Button>
              ) : (
                <Flex align="center" gap={2} ml={3} className="status-off">
                  <span>{/* No relay assigned */}</span>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Col>
        <Col xs={4} className="col col-status">
          <Flex
            align="center"
            gap={2}
            ml={3}
            className={clsx(
              'relay-status',
              `relay-functionality-${isRelayFunctionalityEnabled ? 'on' : 'off'}`,
              { active: isRelayActive },
            )}
          >
            {assignment != null ? (
              <>
                <Flex className="relay-status-indicator">{assignment}</Flex>
                <Flex justify="end">Relay</Flex>
                <Flex justify="center">{assignment}:</Flex>
                <Flex>{isRelayActive ? 'ON' : 'OFF'}</Flex>
              </>
            ) : (
              <>
                <Flex className="relay-status-indicator status-off" />
                <Flex />
                <Flex />
                <Flex />
              </>
            )}
          </Flex>
        </Col>
      </Row>
    </div>
  );
};
