import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import type { excel_data } from "@/typings/data_types";

// Define the initial state using that type
const initialState: excel_data = {
  values: [],
  name: "",
};

export const Cost_of_goods_sold_slice = createSlice({
  name: "cost_of_goods_sold",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateCost_of_goods_sold_slice: (
      state,
      action: PayloadAction<excel_data>
    ) => {
      return { ...state, ...action.payload };
    },
  },
});
export const selectCost_of_goods_sold_slice = (state: RootState) =>
  state.Cost_of_goods_sold;

export const { updateCost_of_goods_sold_slice } =
  Cost_of_goods_sold_slice.actions;
export default Cost_of_goods_sold_slice.reducer;
