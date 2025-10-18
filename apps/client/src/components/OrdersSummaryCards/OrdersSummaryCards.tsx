import React from 'react';
import { Card, Flex, Text } from '@radix-ui/themes';

interface OrdersSummaryCardsProps {
  totalOrders: number;
  filteredResults: number;
  drinkTypes: number;
  volumeOptions: number;
  containerTypes: number;
}

export const OrdersSummaryCards: React.FC<OrdersSummaryCardsProps> = ({
  totalOrders,
  filteredResults,
  drinkTypes,
  volumeOptions,
  containerTypes,
}) => {
  return (
    <Flex gap="4" wrap="wrap">
      <Card>
        <Flex direction="column" align="center" p="4">
          <Text size="6" weight="bold" color="blue">
            {totalOrders}
          </Text>
          <Text size="2" color="gray">
            Total Orders
          </Text>
        </Flex>
      </Card>
      <Card>
        <Flex direction="column" align="center" p="4">
          <Text size="6" weight="bold" color="green">
            {filteredResults}
          </Text>
          <Text size="2" color="gray">
            Filtered Results
          </Text>
        </Flex>
      </Card>
      <Card>
        <Flex direction="column" align="center" p="4">
          <Text size="6" weight="bold" color="orange">
            {drinkTypes}
          </Text>
          <Text size="2" color="gray">
            Drink Types
          </Text>
        </Flex>
      </Card>
      <Card>
        <Flex direction="column" align="center" p="4">
          <Text size="6" weight="bold" color="purple">
            {volumeOptions}
          </Text>
          <Text size="2" color="gray">
            Volume Options
          </Text>
        </Flex>
      </Card>
      <Card>
        <Flex direction="column" align="center" p="4">
          <Text size="6" weight="bold" color="cyan">
            {containerTypes}
          </Text>
          <Text size="2" color="gray">
            Container Types
          </Text>
        </Flex>
      </Card>
    </Flex>
  );
};
