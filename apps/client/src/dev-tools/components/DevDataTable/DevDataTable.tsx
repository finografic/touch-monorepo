import type { CSSProperties } from 'react';
import { styles } from './DevDataTable.styles';

interface Column<T extends Record<string, any>> {
  key: keyof T;
  strong?: boolean;
  styles?: CSSProperties;
}

interface DevDataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  fontSize?: string;
  title?: string;
  getRowKey?: (item: T, index: number) => string | number;
}

export const DevDataTable = <T extends Record<string, any>>({
  data,
  columns,
  fontSize,
  title,
  getRowKey = (item: T) => (item as any).id || 'unknown',
}: DevDataTableProps<T>) => {
  return (
    <div css={styles}>
      {title && <h4>{title}</h4>}

      <div className="results-list">
        {
          data.map((item: T, index: number) => (
            <div key={getRowKey(item, index)} className="result-row result-header">
              {columns.map((column) => (
                <div key={String(column.key)} className="result-col">
                  <strong style={column.styles}>{String(column.key)}</strong>
                </div>
              ))}
            </div>
          ))[0]
        }
        {data.map((item: T, index: number) => (
          <div key={getRowKey(item, index)} className="result-row">
            {columns.map((column) => (
              <div key={String(column.key)} className="result-col">
                {column.strong ? (
                  <strong style={column.styles}>{item[column.key]}</strong>
                ) : (
                  <span style={column.styles}>{item[column.key]}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
