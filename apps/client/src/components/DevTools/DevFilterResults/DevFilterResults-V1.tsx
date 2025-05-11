import { useEffect, useMemo, useState } from 'react';
import { api } from 'api';
import { OrderFieldKeys } from '../../../config/app.config';
import type { DataEntry } from 'types/data.types';
import type { ApiResponse } from '@workspace/shared/types/api.types';
import { styles } from './DevFilterResults.styles';
import { Col, Row } from 'react-grid-system';

export const DevFilterResults = () => {
  const [data, setData] = useState<DataEntry[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Fetch all orders once
  useEffect(() => {
    api.get<ApiResponse<DataEntry[]>>('/orders').then((results) => {
      setData(results.data.data ?? results.data);
    });
  }, []);

  // Compute filtered data
  const filteredData = useMemo(() => {
    return data.filter((entry) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true; // If filter is empty, do not restrict
        switch (key) {
          case OrderFieldKeys.drinkType:
            return entry.drinkTypeName === value;
          case OrderFieldKeys.drinkSubtype:
            return entry.drinkSubtypeName === value;
          case OrderFieldKeys.drinkVolume:
            return entry.volumeName === value;
          case OrderFieldKeys.containerType:
            return entry.containerTypeName === value;
          default:
            return true;
        }
      });
    });
  }, [data, filters]);

  // Get unique values for each filter key
  const uniqueValues = useMemo(() => {
    const values: Record<string, string[]> = {};
    values[OrderFieldKeys.drinkType] = Array.from(
      new Set(data.map((d) => d.drinkTypeName).filter((v): v is string => typeof v === 'string')),
    );
    values[OrderFieldKeys.drinkSubtype] = Array.from(
      new Set(data.map((d) => d.drinkSubtypeName).filter((v): v is string => typeof v === 'string')),
    );
    values[OrderFieldKeys.drinkVolume] = Array.from(
      new Set(data.map((d) => d.volumeName).filter((v): v is string => typeof v === 'string')),
    );
    values[OrderFieldKeys.containerType] = Array.from(
      new Set(data.map((d) => d.containerTypeName).filter((v): v is string => typeof v === 'string')),
    );
    return values;
  }, [data]);

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div id="dev-filter-results" css={styles}>
      <Row>
        <Col xs={12} className="filters">
          <h4>Filters ({Object.keys(filters).length}):</h4>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            {Object.entries(OrderFieldKeys).map(([key, label]) => {
              if (typeof label !== 'string' || !uniqueValues[label] || uniqueValues[label].length === 0)
                return null;
              return (
                <label key={label} style={{ display: 'flex', flexDirection: 'column' }}>
                  {label}
                  <select
                    value={filters[label] || ''}
                    onChange={(e) => handleFilterChange(label, e.target.value)}
                  >
                    <option value="">All</option>
                    {uniqueValues[label].map((val) =>
                      typeof val === 'string' ? (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ) : null,
                    )}
                  </select>
                </label>
              );
            })}
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="results-list">
          <h4>Results: {filteredData.length}</h4>
          <pre>
            {filteredData.map((item: any) => (
              <Row key={item.id}>
                <Col xs={3}>
                  <strong>{item.drinkTypeName}</strong>
                </Col>
                <Col xs={3}>
                  <p>{item.drinkSubtypeName}</p>
                </Col>
                <Col xs={3}>
                  <p>{item.volumeName}</p>
                </Col>
                <Col xs={3}>
                  <p>{item.containerTypeName}</p>
                </Col>
              </Row>
            ))}
          </pre>
        </Col>
      </Row>
    </div>
  );
};
