import React from "react";
import salePriceData from "./salePriceData.json";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { SaleCard } from "./SaleCard";

const CustomizedDot = (props: any) => {
  /**
   * Customize the dot. Only allow dots with visible key set to true.
   */
  const { cx, cy, payload } = props;

  if (payload.visible) {
    return <circle cx={cx} cy={cy} r={7} stroke="white" strokeWidth={4} fill="white" />;
  }

  return null;
};

function TokenSaleChart(props: any) {
  /**
   * Produce time series chart of token price
   */

  const data = props.data;
  const StartTime = data[0].time;
  const EndTime = data[data.length - 1].time;

  function formatXAxis(value: string) {
    /**
     * Set start and end time xticks.
     */
    if (value === StartTime) {
      return "Start";
    }
    if (value === EndTime) {
      return "End";
    }

    return "";
  }

  return (
    <ResponsiveContainer width={"100%"} height={200}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 15, right: 30, left: 30, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="1" horizontal={false} vertical={false} />

        <XAxis
          dataKey="time"
          scale="time"
          axisLine={false}
          tickLine={false}
          tick={false}
          style={{ fontFamily: "American Typewriter", fill: "white" }}
          dy={10}
          ticks={[StartTime, EndTime]}
          tickFormatter={formatXAxis}
        />

        <YAxis
          style={{ fontFamily: "American Typewriter", fill: "white" }}
          axisLine={false}
          tickLine={false}
        />

        <Line
          type="monotone"
          dataKey="price"
          stroke="#DE6B38"
          strokeWidth={4}
          dot={<CustomizedDot />}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function Chart() {
  const currentTokenPrice = Number(7.7).toFixed(2);
  const tokenPriceData = salePriceData;

  return (
    <SaleCard title="Post Sale $JONES Price" className="chart-bg">
      <span className="mr-2 text-2xl font-extrabold">{currentTokenPrice}</span>

      <span className="text-xl font-extrabold">USD</span>

      <TokenSaleChart data={tokenPriceData} />
    </SaleCard>
  );
}

export default Chart;
