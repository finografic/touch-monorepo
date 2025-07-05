import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Select,
  Spinner,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes';
import { AdminContentLayout, AdminSection } from '../shared';
import { useGetOrdersReadable } from 'api/hooks/useOrdersReadable';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import { getFiltersByStep, getUniqueFilterValues, matchesFilters } from 'utils/filters.utils';
import { ORDER_FIELD_KEYS } from 'constants/app.config';
import type { OrderFieldKey } from 'types/orders.types';
import type { OrderFilters } from 'types/filters.types';
import { MagnifyingGlassIcon, ResetIcon } from '@radix-ui/react-icons';

interface FilterStep {
  key: OrderFieldKey;
  label: string;
  selectedValue: string | null;
  availableOptions: Array<{ value: string; count: number }>;
  resultCount: number;
}

export const AdminFilterAnalysisPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<OrderFilters>({});

  // Fetch orders-readable data
  const { data: ordersData = [], isLoading, error } = useGetOrdersReadable();

  // Get unique values for filter options
  const uniqueValues = useMemo(() => getUniqueFilterValues(ordersData), [ordersData]);

  // Calculate filter steps and their data
  const filterSteps = useMemo((): FilterStep[] => {
    const steps: FilterStep[] = [];

    ORDER_FIELD_KEYS.forEach((fieldKey, index) => {
      // Get filters up to (but not including) current step
      const filtersBeforeStep = getFiltersByStep(selectedFilters, fieldKey, false);

      // Get data pool after applying previous filters
      const dataPool = ordersData.filter((order) => matchesFilters(order, filtersBeforeStep));

      // Get available options for current field from filtered data pool
      const fieldValues = dataPool
        .map((order) => {
          // Handle both direct fields and lookup objects
          const fieldValue = order[fieldKey];
          if (typeof fieldValue === 'object' && fieldValue?.name) {
            return fieldValue.name;
          }
          return fieldValue as string;
        })
        .filter(Boolean);

      const valueCounts = fieldValues.reduce(
        (acc, value) => {
          acc[value] = (acc[value] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const availableOptions = Object.entries(valueCounts)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count);

      // Get filters up to and including current step
      const filtersUpToStep = getFiltersByStep(selectedFilters, fieldKey, true);
      const filteredResults = ordersData.filter((order) => matchesFilters(order, filtersUpToStep));

      steps.push({
        key: fieldKey,
        label: getFieldLabel(fieldKey),
        selectedValue: selectedFilters[fieldKey]?.name || null,
        availableOptions,
        resultCount: filteredResults.length,
      });
    });

    return steps;
  }, [ordersData, selectedFilters]);

  // Final filtered data for display
  const filteredOrders = useMemo(() => {
    let results = ordersData;

    // Apply filters
    if (Object.keys(selectedFilters).length > 0) {
      results = results.filter((order) => matchesFilters(order, selectedFilters));
    }

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter((order) =>
        Object.values(order).some((value) => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchLower);
          }
          if (typeof value === 'object' && value?.name) {
            return value.name.toLowerCase().includes(searchLower);
          }
          return false;
        }),
      );
    }

    return results.slice(0, 200); // Limit to 200 for performance
  }, [ordersData, selectedFilters, searchTerm]);

  // Handle filter selection
  const handleFilterChange = (fieldKey: OrderFieldKey, value: string) => {
    if (value === 'all') {
      // Remove this filter
      const { [fieldKey]: removed, ...rest } = selectedFilters;
      setSelectedFilters(rest);
    } else {
      // Find the option to get full data
      const option = filterSteps
        .find((step) => step.key === fieldKey)
        ?.availableOptions.find((opt) => opt.value === value);

      if (option) {
        setSelectedFilters((prev) => ({
          ...prev,
          [fieldKey]: {
            name: value,
            lookup: { [fieldKey]: value },
          },
        }));
      }
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedFilters({});
    setSearchTerm('');
  };

  // Helper function to get field labels
  function getFieldLabel(fieldKey: OrderFieldKey): string {
    switch (fieldKey) {
      case 'drinkType':
        return 'Drink Type';
      case 'drinkSubtype':
        return 'Drink Subtype';
      case 'drinkVolume':
        return 'Volume';
      case 'containerType':
        return 'Container Type';
      case 'temperature':
        return 'Temperature';
      default:
        return fieldKey;
    }
  }

  if (isLoading) {
    return (
      <AdminContentLayout
        title="Filter Analysis"
        subtitle="Analyze orders data and filtering behavior"
        isLoading={true}
      >
        <Flex direction="column" gap="4" align="center" justify="center" p="6">
          <Spinner size="3" />
          <Text>Loading orders data...</Text>
        </Flex>
      </AdminContentLayout>
    );
  }

  if (error) {
    return (
      <AdminContentLayout
        title="Filter Analysis"
        subtitle="Analyze orders data and filtering behavior"
        error={error.message}
      >
        <AdminSection>
          <Text color="red">Error loading orders: {error.message}</Text>
        </AdminSection>
      </AdminContentLayout>
    );
  }

  return (
    <AdminContentLayout title="Filter Analysis" subtitle="Analyze orders data and filtering behavior">
      {/* Summary Stats */}
      <AdminSection title="Data Summary">
        <Flex gap="4" wrap="wrap">
          <Card>
            <Flex direction="column" align="center" p="4">
              <Text size="6" weight="bold" color="blue">
                {ordersData.length}
              </Text>
              <Text size="2" color="gray">
                Total Orders
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" p="4">
              <Text size="6" weight="bold" color="green">
                {filteredOrders.length}
              </Text>
              <Text size="2" color="gray">
                Filtered Results
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" p="4">
              <Text size="6" weight="bold" color="orange">
                {Object.keys(selectedFilters).length}
              </Text>
              <Text size="2" color="gray">
                Active Filters
              </Text>
            </Flex>
          </Card>
        </Flex>
      </AdminSection>

      {/* Filter Flow */}
      <AdminSection title="Cascading Filters">
        <Box mb="4">
          <Flex align="center" gap="3" mb="4">
            <Button variant="soft" color="gray" size="2" onClick={handleResetFilters}>
              <ResetIcon /> Reset All
            </Button>
            <Text size="2" color="gray">
              Select filters to see how data cascades through each step
            </Text>
          </Flex>

          <Flex direction="column" gap="4">
            {filterSteps.map((step, index) => (
              <Card key={step.key}>
                <Flex align="center" justify="between" p="4">
                  <Flex align="center" gap="4">
                    <Badge color="blue" size="2">
                      Step {index + 1}
                    </Badge>
                    <Text weight="bold" size="3">
                      {step.label}
                    </Text>
                    <Badge color={step.resultCount > 0 ? 'green' : 'red'} variant="soft">
                      {step.resultCount} results
                    </Badge>
                  </Flex>

                  <Box style={{ minWidth: '200px' }}>
                    <Select.Root
                      value={step.selectedValue || 'all'}
                      onValueChange={(value) => handleFilterChange(step.key, value)}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Item value="all">All Options</Select.Item>
                        {step.availableOptions.map((option) => (
                          <Select.Item key={option.value} value={option.value}>
                            {option.value} ({option.count})
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Box>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Box>
      </AdminSection>

      {/* Search and Results */}
      <AdminSection title="Orders Data">
        <Flex justify="between" align="center" mb="4">
          <Flex align="center" gap="3">
            <TextField.Root
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="2"
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </Flex>

          <Text size="2" color="gray">
            Showing {filteredOrders.length} of {ordersData.length} orders
          </Text>
        </Flex>

        {/* Results Table */}
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Order ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Drink Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Subtype</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Volume</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Container</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Temperature</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredOrders.map((order) => (
              <Table.Row key={order.id}>
                <Table.Cell>
                  <Text size="1" family="mono">
                    {order.id.slice(0, 8)}...
                  </Text>
                </Table.Cell>
                <Table.Cell>{order.drinkType || '-'}</Table.Cell>
                <Table.Cell>{order.drinkSubtype || '-'}</Table.Cell>
                <Table.Cell>{order.volumeName || '-'}</Table.Cell>
                <Table.Cell>{order.containerTypeName || '-'}</Table.Cell>
                <Table.Cell>{order.defaultTempConsume ? `${order.defaultTempConsume}°C` : '-'}</Table.Cell>
                <Table.Cell>
                  <Text size="1">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                  </Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <Flex direction="column" align="center" justify="center" py="8">
            <Text size="3" color="gray">
              No orders found
            </Text>
            <Text size="2" color="gray">
              Try adjusting your filters or search term
            </Text>
          </Flex>
        )}
      </AdminSection>
    </AdminContentLayout>
  );
};
