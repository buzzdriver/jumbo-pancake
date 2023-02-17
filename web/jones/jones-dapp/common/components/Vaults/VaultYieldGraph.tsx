import { FC, useState } from "react";

import { Box, Button, Heading, HStack, useBreakpointValue, useTheme } from "@chakra-ui/react";
import { capitalize } from "lodash";
import {
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import config from "../../config";
import { useLineColors } from "../../hooks/useLineColors";
import { getJonesColor } from "../../theme/helpers";
import {
  axisDefaultConfig,
  DateRange,
  getFilterMonths,
  getTicks,
  roiToApy,
  separateCamelCase,
} from "../../utils/helpers";
import { renderPercentage } from "../../utils/numbers";
import { VaultYieldGraphTooltip } from "./VaultYieldGraphTooltip";

export const VaultYieldGraph: FC = () => {
  const { grayMid } = getJonesColor(useTheme());
  const [dateRange, setDateRange] = useState<DateRange>("All");
  const lineColors = useLineColors();
  const apyData = Object.entries(config.vaultData).reduce(
    (acc: Record<string, string | number>[], [vaultName, vaultData]) => {
      const roiListCum: [string, number][] = Object.entries(vaultData.roi)
        .reduce((acc: [string, number][], [epoch, roi], i) => {
          acc.push([epoch, i ? roi + acc[i - 1][1] : roi]);
          return acc;
        }, [])
        .map(([epoch, roi]) => [epoch, roi / 100]);

      const apyList: [string, number][] = roiListCum.map(([epoch, roi], i) =>
        i ? [epoch, roiToApy(roi / (i + 1))] : [epoch, roiToApy(roi)],
      );

      apyList.forEach(([epoch, apy]) => {
        const existingEpoch = acc.find((data) => data.epoch === epoch);
        if (existingEpoch) {
          existingEpoch[vaultName] = apy;
        } else {
          acc.push({
            epoch,
            [vaultName]: apy,
          });
        }
      });

      return acc;
    },
    [],
  );

  // Reverse array to put most recent epoch first, get relevant months, and reverse again for chronological order
  // This assumes current apy data is already in chronological order
  const apyDataFiltered =
    dateRange === "All"
      ? apyData
      : apyData.reverse().slice(0, getFilterMonths(dateRange)).reverse();

  const lines = Object.keys(config.vaultData);
  const { min, max } = apyData.reduce(
    (acc: { min: number; max: number }, curr) => {
      const apyList = Object.values(curr).filter(Number) as number[];
      const max = Math.max(...apyList);
      const min = Math.min(...apyList);
      if (acc.max < max) acc.max = max;
      if (acc.min > min) acc.min = min;
      return acc;
    },
    { min: 0, max: 0 },
  );

  const yTicks = getTicks(min, max, 5);
  const filters: DateRange[] = ["All", "1M", "3M", "6M", "1Y", "YTD"];
  const additionalStyle = (selected: boolean) =>
    selected ? {} : { bg: "transparent", color: "gray.500" };

  return (
    <Box fontSize="sm" data-test="vault-yield-graph" pb={8}>
      <Heading size="xs" position="relative">
        Avg. Historical Yield
      </Heading>
      <HStack mt={8} mb={4} spacing={4} justify="center">
        {filters.map((filter) => (
          <Button
            variant="tertiary"
            size="sm"
            key={filter}
            onClick={() => setDateRange(filter)}
            w="50px"
            {...additionalStyle(filter === dateRange)}
          >
            {filter}
          </Button>
        ))}
      </HStack>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={apyDataFiltered}
          margin={{
            top: 16,
            right: 12,
            left: 12,
          }}
        >
          <XAxis
            dataKey="epoch"
            {...axisDefaultConfig}
            tickFormatter={(v: string) => capitalize(separateCamelCase(v))}
            label={{ value: "EPOCH", fill: grayMid, position: "bottom" }}
          />
          <YAxis
            {...axisDefaultConfig}
            tickFormatter={(pct: number) => renderPercentage(pct)}
            label={{ value: "APY", fill: grayMid, angle: -90, position: "left" }}
            ticks={yTicks}
            interval={0}
          />
          <Tooltip content={VaultYieldGraphTooltip} />
          <Legend
            align={useBreakpointValue({ base: "center", md: "right" })}
            iconType="circle"
            iconSize={12}
            formatter={(value: string) => (
              <span style={{ margin: 0, color: grayMid, fontWeight: 500, fontSize: 12 }}>
                {value}
              </span>
            )}
            wrapperStyle={{ position: "relative", width: "100%", right: 0 }}
          />
          <ReferenceLine y={0} stroke="white" strokeDasharray="3 3" />
          {lines.map((name, i) => (
            <Line
              // on 1m filter, dots are not shown if animation is active
              isAnimationActive={dateRange !== "1M"}
              key={i}
              type="linear"
              dataKey={name}
              stroke={lineColors[i]}
              strokeWidth={2}
              dot={{ strokeWidth: 2, fill: lineColors[i] }}
              activeDot={{ strokeWidth: 1 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
