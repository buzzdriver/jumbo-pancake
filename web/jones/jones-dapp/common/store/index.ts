import create from "zustand";
import { devtools } from "zustand/middleware";

import { FeedbackComponents, feedbackComponentsSlice } from "./feedbackComponents";
import { MarketPrices, marketPricesSlice } from "./marketPrices";
import { FarmsSlice, farmsSlice } from "./staking";
import { Vaults, vaultSlice } from "./vaults";
import { Web3Data, web3DataSlice } from "./web3Data";

export interface AppState {
  web3Data: Web3Data;
  marketPrices: MarketPrices;
  staking: FarmsSlice;
  vaults: Vaults;
  feedbackComponents: FeedbackComponents;
}

export const useStore = create<AppState>(
  devtools((set, get) => ({
    web3Data: web3DataSlice(set, get),
    marketPrices: marketPricesSlice(set, get),
    staking: farmsSlice(set, get),
    vaults: vaultSlice(set, get),
    feedbackComponents: feedbackComponentsSlice(set),
  })),
);
