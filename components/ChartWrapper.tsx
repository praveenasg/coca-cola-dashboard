"use client";
import React from "react";
import { updateCost_of_goods_sold_slice } from "@/features/chart/Cost_of_goods_sold_slice";
import { updateGross_Profit_slice } from "@/features/chart/Gross_Profit_slice";
import { updateNet_operating_revenue_slice } from "@/features/chart/Net_operating_revenue_slice";
import { useAppDispatch } from "@/lib/hooks";
import { excel_data } from "@/typings/data_types";
import * as d3 from "d3";
import { DSVRowString } from "d3";
import { useEffect } from "react";
import MultilineChart from "./line-graph/MultilineChart";

function ChartWrapper() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    d3.csv("/chart_data.csv", function (data: DSVRowString) {
      const current_row: excel_data = {
        values: [
          { year: 2009, value: parseInt(data.year_2009) },
          { year: 2010, value: parseInt(data.year_2010) },
          { year: 2011, value: parseInt(data.year_2011) },
          { year: 2012, value: parseInt(data.year_2012) },
          { year: 2013, value: parseInt(data.year_2013) },
          { year: 2014, value: parseInt(data.year_2014) },
          { year: 2015, value: parseInt(data.year_2015) },
          { year: 2016, value: parseInt(data.year_2016) },
          { year: 2017, value: parseInt(data.year_2017) },
          { year: 2018, value: parseInt(data.year_2018) },
        ],
        name: data.Name,
      };
      if (current_row.name === "Net_operating_revenues") {
        dispatch(updateNet_operating_revenue_slice(current_row));
      }
      if (current_row.name === "Cost_of_goods_sold") {
        dispatch(updateCost_of_goods_sold_slice(current_row));
      }
      if (current_row.name === "Gross_Profit") {
        dispatch(updateGross_Profit_slice(current_row));
      }
      return data;
    });
  }, [dispatch]);
  return (
    <div>
      <MultilineChart />
    </div>
  );
}

export default ChartWrapper;
