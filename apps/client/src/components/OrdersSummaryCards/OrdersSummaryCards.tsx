import React from 'react';

import { Flex } from 'styled-system/jsx';
import { card } from 'styled-system/recipes';

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
      <div className={card()}>
        <Flex direction="column" align="center" p="4">
          <span>{totalOrders}</span>
          <span>Total Orders</span>
        </Flex>
      </div>
      <div className={card()}>
        <Flex direction="column" align="center" p="4">
          <span>{filteredResults}</span>
          <span>Filtered Results</span>
        </Flex>
      </div>
      <div className={card()}>
        <Flex direction="column" align="center" p="4">
          <span>{drinkTypes}</span>
          <span>Drink Types</span>
        </Flex>
      </div>
      <div className={card()}>
        <Flex direction="column" align="center" p="4">
          <span>{volumeOptions}</span>
          <span>Volume Options</span>
        </Flex>
      </div>
      <div className={card()}>
        <Flex direction="column" align="center" p="4">
          <span>{containerTypes}</span>
          <span>Container Types</span>
        </Flex>
      </div>
    </Flex>
  );
};
