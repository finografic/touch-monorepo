import { DataList } from '@radix-ui/themes';

export const OrderDataList = ({ data }: { data: any }) => {
  if (!data) return null;
  return (
    <DataList.Root>
      {data.drinkType && (
        <DataList.Item>
          <DataList.Label className="label">Drink Type</DataList.Label>
          <DataList.Value className="value">{data.drinkType}</DataList.Value>
        </DataList.Item>
      )}
      {data.drinkSubtype && (
        <DataList.Item>
          <DataList.Label className="label">Subtype</DataList.Label>
          <DataList.Value className="value">{data.drinkSubtype}</DataList.Value>
        </DataList.Item>
      )}
      {data.volume && (
        <DataList.Item>
          <DataList.Label className="label">Volume</DataList.Label>
          <DataList.Value className="value">{data.volume}</DataList.Value>
        </DataList.Item>
      )}
      {data.containerType && (
        <DataList.Item>
          <DataList.Label className="label">Container</DataList.Label>
          <DataList.Value className="value">{data.containerType}</DataList.Value>
        </DataList.Item>
      )}
      {data.initialTemperature && (
        <DataList.Item>
          <DataList.Label className="label">Initial Temperature</DataList.Label>
          <DataList.Value className="value">{data.initialTemperature}</DataList.Value>
        </DataList.Item>
      )}
      {data.finalTemperature && (
        <DataList.Item>
          <DataList.Label className="label">Final Temperature</DataList.Label>
          <DataList.Value className="value">{data.finalTemperature}</DataList.Value>
        </DataList.Item>
      )}
    </DataList.Root>
  );
};
