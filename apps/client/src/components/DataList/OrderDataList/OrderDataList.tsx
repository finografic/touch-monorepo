import { DataList } from '@radix-ui/themes';
import { styles } from './OrderDataList.styles';
import type { OrderReadableModel } from 'types/models/order-readable.model';

export const OrderDataList = ({ data }: { data: OrderReadableModel }) => {
  console.log('OrderDataList received data:', data);

  if (!data) {
    console.log('OrderDataList: No data provided');
    return (
      <div css={styles} className="data-list-empty">
        No order data available
      </div>
    );
  }

  // Helper function to format field names for display
  const formatFieldName = (fieldKey: string): string => {
    return fieldKey
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  };

  // Helper function to get display value for each field
  const getDisplayValue = (fieldKey: string, orderData: OrderReadableModel): string => {
    switch (fieldKey) {
      case 'drinkType':
        return orderData.drinkType || 'N/A';
      case 'drinkSubtype':
        return orderData.drinkSubtype || 'N/A';
      case 'drinkVolume':
        return orderData.volume || 'N/A';
      case 'containerType':
        return orderData.containerType || 'N/A';
      case 'temperature':
        return orderData.temperatureProfile || 'N/A';
      case 'defaultTempConsume':
        return orderData.defaultTempConsume?.toString() || 'N/A';
      case 'defaultTempFreeze':
        return orderData.defaultTempFreeze?.toString() || 'N/A';
      default:
        return 'N/A';
    }
  };

  // Define which fields to display
  const displayFields = [
    'drinkType',
    'drinkSubtype',
    'drinkVolume',
    'containerType',
    'temperature',
    'defaultTempConsume',
    'defaultTempFreeze',
  ];

  return (
    <div css={styles} className="data-list-wrapper">
      <DataList.Root className="data-list">
        {/* Display order data fields */}
        {displayFields.map((fieldKey) => (
          <DataList.Item key={fieldKey}>
            <DataList.Label className="label">{formatFieldName(fieldKey)}</DataList.Label>
            <DataList.Value className="value">{getDisplayValue(fieldKey, data)}</DataList.Value>
          </DataList.Item>
        ))}
      </DataList.Root>
    </div>
  );
};
