import Net_operating_revenue_sliceReducer from "@/features/chart/Net_operating_revenue_slice";
import Cost_of_goods_sold_sliceReducer from "@/features/chart/Cost_of_goods_sold_slice";
import Gross_Profit_sliceReducer from "@/features/chart/Gross_Profit_slice";
import { configureStore } from "@reduxjs/toolkit";

export const makeStore = () => {
  return configureStore({
    reducer: {
      Net_operating_revenue: Net_operating_revenue_sliceReducer,
      Cost_of_goods_sold: Cost_of_goods_sold_sliceReducer,
      Gross_Profit: Gross_Profit_sliceReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
