import { useStore } from "../store";
import { Web3State } from "../store/web3Data";

export type DateRange = "All" | "1M" | "3M" | "6M" | "1Y" | "YTD";

export function shorten(str: string | undefined) {
  if (!str) return;
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export const getWeb3State = (): Web3State => {
  const {
    web3Data: { state },
  } = useStore.getState();

  return state;
};

export const findObjectValue = (obj: any, keyName: string, messageArray: any[]) => {
  Object.keys(obj).forEach((key) => {
    if (key == keyName) {
      messageArray.push(obj[key]);
    }
    if (typeof obj[key] === "object" && obj[key] !== null) {
      findObjectValue(obj[key], keyName, messageArray);
    }
  });
};

export const roiToApy = (roi: number): number => ((1 + roi) ** 12 - 1) * 100;

export const separateCamelCase = (value: string) => value.replace(/([a-z0-9])([A-Z0-9])/g, "$1 $2");

export const axisDefaultConfig = {
  axisLine: false,
  tickLine: false,
  tick: { fill: "white", fontSize: 12 },
};

export const getTicks = (min: number, max: number, tickGap: number) => {
  const minRounded = Math.floor(min / tickGap) * tickGap;
  const maxRounded = Math.ceil(max / tickGap) * tickGap;
  return Array.from(
    { length: (maxRounded - minRounded) / tickGap + 1 },
    (_, i) => minRounded + tickGap * i,
  );
};

export const getFilterMonths = (dateRange: DateRange) => {
  switch (dateRange) {
    case "1M":
      return 1;
    case "3M":
      return 3;
    case "6M":
      return 6;
    case "YTD":
      return new Date().getMonth();

    default:
      return 100;
  }
};
