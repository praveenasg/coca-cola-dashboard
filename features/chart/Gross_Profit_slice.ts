import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import type { excel_data } from "@/typings/data_types";

// Define the initial state using that type
const initialState: excel_data = {
  values: [],
  name: "",
};

export const Gross_Profit_slice = createSlice({
  name: "Gross_Profit",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateGross_Profit_slice: (state, action: PayloadAction<excel_data>) => {
      return { ...state, ...action.payload };
    },
  },
});
export const selectGross_Profit_slice = (state: RootState) =>
  state.Gross_Profit;

export const { updateGross_Profit_slice } = Gross_Profit_slice.actions;
export default Gross_Profit_slice.reducer;
