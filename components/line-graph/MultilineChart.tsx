"use client";
import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { selectCost_of_goods_sold_slice } from "@/features/chart/Cost_of_goods_sold_slice";
import { selectGross_Profit_slice } from "@/features/chart/Gross_Profit_slice";
import { selectNet_operating_revenue_slice } from "@/features/chart/Net_operating_revenue_slice";
import { useAppSelector } from "@/lib/hooks";
import { excel_data, year_value_pair } from "@/typings/data_types";

interface CustomSVGElement extends SVGSVGElement {
  value: year_value_pair | null;
}

const MultilineChart: React.FC = () => {
  const net_operating_revenue = useAppSelector(
    selectNet_operating_revenue_slice
  );
  const cost_of_goods_sold = useAppSelector(selectCost_of_goods_sold_slice);
  const gross_profit = useAppSelector(selectGross_Profit_slice);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const data = useMemo(
    () => [
      { ...net_operating_revenue, name: "Net Operating Revenue" },
      { ...cost_of_goods_sold, name: "Cost of Goods Sold" },
      { ...gross_profit, name: "Gross Profit" },
    ],
    [net_operating_revenue, cost_of_goods_sold, gross_profit]
  );

  useEffect(() => {
    if (containerRef.current) {
      // Clear any previous chart
      containerRef.current.innerHTML = "";

      const width = 1000;
      const height = 600;
      const marginTop = 20;
      const marginRight = 20;
      const marginBottom = 30;
      const marginLeft = 30;

      const x = d3
        .scaleUtc()
        .domain(
          d3.extent(data[0].values, (d) => new Date(d.year, 0, 1)) as [
            Date,
            Date
          ]
        )
        .range([marginLeft, width - marginRight]);

      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data.flatMap((d) => d.values.map((v) => v.value))) ?? 0,
        ])
        .nice()
        .range([height - marginBottom, marginTop]);

      const svg = d3
        .select(containerRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr(
          "style",
          "max-width: 100%; height: auto; overflow: visible; font: 10px sans-serif;"
        );

      // Append x axis with transition
      svg
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call((g) =>
          g
            .transition()
            .duration(1000)
            .call(
              d3
                .axisBottom(x)
                .ticks(width / 80)
                .tickSizeOuter(0)
            )
        );

      // Append y axis with transition
      svg
        .append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call((g) => g.transition().duration(1000).call(d3.axisLeft(y)))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick line")
            .clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1)
        )
        .call((g) =>
          g
            .append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("↑ Value")
        );

      const line = d3
        .line<year_value_pair>()
        .x((d) => x(new Date(d.year, 0, 1)))
        .y((d) => y(d.value));

      const color = d3
        .scaleOrdinal<string>()
        .domain(data.map((d) => d.name))
        .range(d3.schemeCategory10);

      // Append paths with transition
      const path = svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke-width", 5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .selectAll("path")
        .data(data)
        .join("path")
        .attr("stroke", (d) => color(d.name) as string)
        .attr("d", (d) => line(d.values) as string)
        .call((path) =>
          path
            .transition()
            .duration(1000)
            .attrTween("stroke-dasharray", function () {
              const length = (this as SVGPathElement).getTotalLength();
              return d3.interpolate(`0,${length}`, `${length},${length}`);
            })
        ) as d3.Selection<SVGPathElement, excel_data, SVGGElement, unknown>;

      const dot = svg.append("g").attr("display", "none");

      dot.append("circle").attr("r", 2.5);

      dot
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", -8)
        .attr("font-size", "20");

      svg
        .on("pointerenter", () => pointerentered(path, dot))
        .on("pointermove", (event) =>
          pointermoved(event, data, path, dot, svg, x, y)
        )
        .on("pointerleave", () => pointerleft(path, dot, svg))
        .on("touchstart", (event) => event.preventDefault());
    }
  }, [data]);

  return (
    <div className="flex flex-col  items-center">
      <h1 className="font-bold text-center p-4">
        Net Operating Revenues, Cost of Goods Sold, and Gross Profit
      </h1>
      <div id="container" ref={containerRef}></div>
    </div>
  );
};

function pointermoved(
  event: PointerEvent,
  data: excel_data[],
  path: d3.Selection<SVGPathElement, excel_data, SVGGElement, unknown>,
  dot: d3.Selection<SVGGElement, unknown, null, undefined>,
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: d3.ScaleTime<number, number>,
  y: d3.ScaleLinear<number, number>
) {
  const [xm, ym] = d3.pointer(event);
  const closestDataPoints = data.map((dataset) => {
    const closestIndex = d3.leastIndex(dataset.values, (v) =>
      Math.hypot(x(new Date(v.year, 0, 1)) - xm, y(v.value) - ym)
    );
    return closestIndex !== undefined
      ? { dataset, point: dataset.values[closestIndex] }
      : null;
  });

  const closestPoint = closestDataPoints
    .filter((d) => d !== null)
    .sort(
      (a, b) =>
        Math.hypot(
          x(new Date(a!.point.year, 0, 1)) - xm,
          y(a!.point.value) - ym
        ) -
        Math.hypot(
          x(new Date(b!.point.year, 0, 1)) - xm,
          y(b!.point.value) - ym
        )
    )[0];

  if (!closestPoint) return;

  const { dataset, point } = closestPoint;

  path
    .style("stroke", (d) => (d === dataset ? null : "#ddd"))
    .filter((d) => d === dataset)
    .raise();

  dot.attr(
    "transform",
    `translate(${x(new Date(point.year, 0, 1))},${y(point.value)})`
  );

  dot
    .select("text")
    .transition() // Start the transition
    .duration(500) // Duration of the animation in milliseconds
    .style("opacity", 0) // Start with the text being invisible
    .transition() // Chain another transition
    .duration(500) // Duration of the second part of the animation
    .style("opacity", 1) // Fade the text to full opacity
    .text(`${dataset.name}: ${point.value}`); // Update the text

  (svg.node() as CustomSVGElement).value = point;
  svg.dispatch("input", { bubbles: true, detail: point, cancelable: false });
}

function pointerentered(
  path: d3.Selection<SVGPathElement, excel_data, SVGGElement, unknown>,
  dot: d3.Selection<SVGGElement, unknown, null, undefined>
) {
  path.style("mix-blend-mode", null).style("stroke", "#ddd");
  dot.attr("display", null);
}

function pointerleft(
  path: d3.Selection<SVGPathElement, excel_data, SVGGElement, unknown>,
  dot: d3.Selection<SVGGElement, unknown, null, undefined>,
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
) {
  path.style("mix-blend-mode", "multiply").style("stroke", null);
  dot.attr("display", "none");
  (svg.node() as CustomSVGElement).value = null;
  svg.dispatch("input", { bubbles: true, detail: null, cancelable: false });
}

export default MultilineChart;
