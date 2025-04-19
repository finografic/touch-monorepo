export type DrinkType = {
  id: string;
  name: string;
  display_name: string;
  has_subtypes: number;
  default_consumption_time: number;
  default_freeze_temp: number;
  is_active: number;
};

export type DrinkSubtype = {
  id: string;
  drink_type_id: string;
  name: string;
  display_name: string;
  is_active: number;
};
