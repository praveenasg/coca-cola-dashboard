type year_value_pair = {
  year: number;
  value: number;
};
type excel_data = {
  name: string;
  values: year_value_pair[];
};

export type { excel_data, year_value_pair };
