import { coingeckoIds } from "@jones-dao/sdk";
import produce from "immer";
import { GetState } from "zustand";
import { NamedSet } from "zustand/middleware";

import config from "../config";
import { fetchUrl } from "../utils/queries";
import { AppState } from "./";

// Refresh interval in ms. 5 minutes
const REFRESH_INTERVAL = 5 * 60 * 1000;
export interface MarketPricesState {
  timestampLast: number;
  [key: string]: number;
}

interface MarketPricesActions {
  fetchMarketPrices: () => void;
}

export interface MarketPrices {
  state: MarketPricesState;
  actions: MarketPricesActions;
}

const defaultState: MarketPricesState = Object.values(coingeckoIds).reduce(
  (acc: MarketPricesState, curr) => {
    acc[curr] = 0;
    return acc;
  },
  { timestampLast: 0 },
);

export const marketPricesSlice = (
  set: NamedSet<AppState>,
  get: GetState<AppState>,
): MarketPrices => ({
  state: defaultState,
  actions: {
    fetchMarketPrices: async () => {
      const currentTime = Date.now();
      const {
        marketPrices: {
          state: { timestampLast },
        },
      } = get();

      if (timestampLast && timestampLast + REFRESH_INTERVAL < currentTime) return;

      const { prices } = await fetchUrl<{ prices: { [tokenName: string]: number } }>(
        config.apiUrl + "/v1/jones/prices",
      );
      const marketPrices: MarketPricesState = { timestampLast: currentTime, ...prices };

      set(
        produce((draft: AppState) => {
          draft.marketPrices.state = marketPrices;
        }),
        false,
        "fetchMarketPrices",
      );
    },
  },
});
