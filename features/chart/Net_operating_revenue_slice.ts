import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import type { excel_data } from "@/typings/data_types";

// Define the initial state using that type
const initialState: excel_data = {
  values: [],
  name: "",
};

export const Net_operating_revenue_slice = createSlice({
  name: "net_operating_revenue",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateNet_operating_revenue_slice: (
      state,
      action: PayloadAction<excel_data>
    ) => {
      return { ...state, ...action.payload };
    },
  },
});
export const selectNet_operating_revenue_slice = (state: RootState) =>
  state.Net_operating_revenue;

export const { updateNet_operating_revenue_slice } =
  Net_operating_revenue_slice.actions;
export default Net_operating_revenue_slice.reducer;
