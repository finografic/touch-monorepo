/** Primitive types supported in API responses */
export type DataType = string | number | boolean | null | undefined;

/** Base interface for API resource objects */
export interface DataEntry {
  /** Optional unique identifier */
  id?: string;
  /** Dynamic keys supporting primitive values, arrays, and nested objects */
  [key: string]: DataType | DataType[] | Record<string, DataType> | DataEntry;
}

/** Generic type for loader data that can be either a single entry or array */
export type Dataset<T extends DataEntry = DataEntry> = T[] | T;

/** Type guard to narrow Dataset<T> to T[] */
export const isDatasetArray = <T extends DataEntry>(data: Dataset<T>): data is T[] => {
  return Array.isArray(data);
};

// Utility type for route loader data
export interface RouteLoaderData<T extends DataEntry = DataEntry> {
  data: Dataset<T>;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    [key: string]: DataType | undefined;
  };
}

// Params type for route parameters
export interface RouteParams {
  [key: string]: string | number | boolean | undefined;
}

// Storage interface for persistent data
export interface Storage {
  [key: string]: DataType | Storage | undefined;
}

// Only use this as a last resort when types are truly unknown
export interface Generic {
  [key: string]: unknown;
}
