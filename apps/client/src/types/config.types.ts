export type FieldName = 'line1' | 'line2' | 'city' | 'county' | 'country' | 'postcode';

export type AddressFieldUI = {
  name: FieldName;
  label: string;
  displayOrder: number;
  regex?: RegExp;
  required: boolean;
  inputWidth: '100px' | '';
  labelWidth: 50;
  maxLength: 255;
  componentType: 'select' | 'textbox';
  list?: string[];
};

export const FIELDNAME_ALLOWLIST: Array<FieldName> = [
  'line1',
  'line2',
  'city',
  'county',
  'country',
  'postcode',
] as const;

export const PROPERTY_ALLOWLIST: Array<keyof AddressFieldUI> = [
  'label',
  'regex',
  'required',
  'maxLength',
  'componentType',
  'list',
] as const;

type OptionalProperty = Partial<Pick<AddressFieldUI, (typeof PROPERTY_ALLOWLIST)[number]>>;

// Clean version that works
export type FieldConfigOverrides =
  | ({ [K in (typeof FIELDNAME_ALLOWLIST)[number]]?: OptionalProperty } & { all?: never })
  | { all: OptionalProperty };

// This should show a TypeScript error
export const TEST_ME: FieldConfigOverrides = {
  postcode: { required: true, regex: undefined },
  city: {
    required: false,
    label: 'City/Town',
  },
  all: { required: true }, // This should show an error
};
