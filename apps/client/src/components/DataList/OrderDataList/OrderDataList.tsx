import { DataList } from '@radix-ui/themes';
import { styles } from './OrderDataList.styles';

export const OrderDataList = ({ data }: { data: any }) => {
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

  // Helper function to extract the lookup value from each filter
  const extractLookupValue = (fieldKey: string, filterData: any): string => {
    if (!filterData?.lookup) {
      // Fallback to name if no lookup
      return filterData?.name || 'N/A';
    }

    // Map field keys to their respective lookup keys
    const lookupMapping: Record<string, string> = {
      drinkType: 'drinkTypeName',
      drinkSubtype: 'drinkSubtypeName',
      drinkVolume: 'volumeName',
      containerType: 'containerTypeName',
    };

    const lookupKey = lookupMapping[fieldKey];
    if (lookupKey && filterData.lookup[lookupKey]) {
      return filterData.lookup[lookupKey];
    }

    // Fallback to first available lookup value or name
    const lookupValues = Object.values(filterData.lookup);
    return (lookupValues[0] as string) || filterData.name || 'N/A';
  };

  return (
    <div css={styles} className="data-list-wrapper">
      <DataList.Root className="data-list">
        {/* Show basic item info */}
        {data.itemType && (
          <DataList.Item>
            <DataList.Label className="label">Item Type</DataList.Label>
            <DataList.Value className="value">{data.itemType}</DataList.Value>
          </DataList.Item>
        )}

        {data.itemNumber !== undefined && (
          <DataList.Item>
            <DataList.Label className="label">Item Number</DataList.Label>
            <DataList.Value className="value">{data.itemNumber}</DataList.Value>
          </DataList.Item>
        )}

        {/* Dynamically iterate over filters */}
        {data.filters &&
          Object.entries(data.filters).map(([fieldKey, filterData]: [string, any]) => (
            <DataList.Item key={fieldKey}>
              <DataList.Label className="label">{formatFieldName(fieldKey)}</DataList.Label>
              <DataList.Value className="value">{extractLookupValue(fieldKey, filterData)}</DataList.Value>
            </DataList.Item>
          ))}
      </DataList.Root>
    </div>
  );
};
