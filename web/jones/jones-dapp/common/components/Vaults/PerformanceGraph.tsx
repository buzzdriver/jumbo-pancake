import React from "react";

import { Box, Heading, Text, useTheme } from "@chakra-ui/react";
import { capitalize } from "lodash";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

import { getJonesColor } from "../../theme/helpers";
import { getTicks, separateCamelCase } from "../../utils/helpers";
import { renderPercentage } from "../../utils/numbers";

export default function PerformanceGraph({
  toolTipText,
  isMonthlyReturn,
  data,
  title,
  xaxisLabel,
  referenceLineVal,
}: {
  toolTipText: string;
  isMonthlyReturn: boolean;
  data: { month: string; value: number }[];
  title: string;
  xaxisLabel: string;
  referenceLineVal: number;
}) {
  const minVal = Math.min(...data.map((item: { month: string; value: number }) => item.value));
  const maxVal = Math.max(...data.map((item: { month: string; value: number }) => item.value));
  const yTicks = getTicks(minVal, maxVal, 0.5);
  const { grayLight, grayMid, primaryLight } = getJonesColor(useTheme());
  const axisDefaultConfig = {
    axisLine: false,
    tickLine: false,
    tick: { fill: grayLight, fontSize: 12 },
  };

  const CustomToolTip = (
    props: { toolTipText: string; isMonthlyReturn: boolean } & TooltipProps<ValueType, NameType>,
  ) => {
    const { active, payload, label, toolTipText, isMonthlyReturn } = props;
    const { grayDark } = getJonesColor(useTheme());

    if (active && payload && payload.length) {
      return (
        <Box
          bg={grayDark}
          borderRadius="xl"
          py={5}
          px={4}
          textColor="white"
          width={"179px"}
          height={"80px"}
          fontSize="sm"
        >
          <Text>
            <Text as="span" fontWeight="bold">
              {toolTipText}
            </Text>
            {isMonthlyReturn && capitalize(separateCamelCase(label))}
          </Text>
          {isMonthlyReturn && <Text> {renderPercentage(Number(payload[0].value))}</Text>}
        </Box>
      );
    }

    return null;
  };

  return (
    <Box
      data-test="performance-chart"
      py={8}
      px={{ base: 4, md: 8 }}
      textColor="white"
      position="relative"
    >
      <Heading size="xs" fontWeight="bold" mb={{ base: 4, md: 6 }}>
        {title}
      </Heading>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 24 }}>
          <XAxis
            dataKey="month"
            {...axisDefaultConfig}
            interval={0}
            label={{
              value: xaxisLabel,
              fill: grayMid,
              position: "insideBottomLeft",
              dx: -60,
              dy: 24,
              fontStyle: "italic",
              fontSize: "12",
            }}
            dy={12}
            tickFormatter={(v: string) => capitalize(separateCamelCase(v)).split(" ")[0]}
          />
          <YAxis
            dx={-12}
            {...axisDefaultConfig}
            tickFormatter={(tick) => `${tick}%`}
            ticks={yTicks}
            interval={0}
          />
          <Tooltip
            content={<CustomToolTip toolTipText={toolTipText} isMonthlyReturn={isMonthlyReturn} />}
          />
          <ReferenceLine y={referenceLineVal} strokeDasharray="5 5" />
          <Line
            dataKey="value"
            stroke={primaryLight}
            strokeWidth={2}
            activeDot={{ strokeWidth: 1 }}
            dot={{ fill: primaryLight, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
