// REF - Record TYPE: https://fjolt.com/article/typescript-record-type

// export type UnknownArrayOrObject = unknown[] | Record<string, unknown>;

// export type UnknownArrayOrObject = Record<string, unknown | SelectOption> | SelectOption[];

// V1:
// export type DataType = string | number | boolean | Blob;
// V2:
// Base type for primitive values commonly found in API responses
// type APIValue = string | number | boolean | null | undefined; (ORIGINALLY FOR DataEntry)
export type DataType = string | number | boolean | null | undefined | Blob;

// V1:
// export type DataEntry = Record<string, string | number | boolean>;
// V2:
// Allow nested objects and arrays while maintaining flexibility
// export type DataEntry = {
//   [K: string]: DataType | DataType[] | Record<string, DataType> | DataEntry;
// };

// export interface ISchema extends DataEntry {}

// export interface DataEntryFromModel {
//   fieldsName: string;
//   dataType: string;
//   allowNull?: boolean;
// }
export interface IParams {
  [key: string]: string | number | boolean;
}

export interface IStorage {
  [key: string]: string | number | boolean | IStorage | undefined;
}

export interface IGeneric {
  [key: string]: any;
}
