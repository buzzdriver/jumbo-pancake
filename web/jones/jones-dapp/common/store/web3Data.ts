import { Signer } from "ethers";
import produce from "immer";
import { GetState } from "zustand";
import { NamedSet } from "zustand/middleware";

import { AppState } from "./";

export interface Web3State {
  address: string | undefined;
  ens: string | null;
  signer: Signer | undefined;
  chainId: number;
  isSupportedChain: boolean;
}

interface Web3Actions {
  resetState: () => void;
  setWeb3Data: (web3Data: Web3State) => void;
  setAddress: (address: string) => void;
  setEns: (ens: string | null) => void;
}

export interface Web3Data {
  state: Web3State;
  actions: Web3Actions;
}

export const defaultChain = 42161; // arbitrum
// export const defaultChain = 1337; // localhost

const defaultState: Web3State = {
  address: undefined,
  ens: null,
  signer: undefined,
  chainId: defaultChain,
  isSupportedChain: true,
};

export const web3DataSlice = (set: NamedSet<AppState>, get: GetState<AppState>): Web3Data => ({
  state: defaultState,
  actions: {
    setWeb3Data: (web3Data) =>
      set(
        produce((draft: AppState) => {
          draft.web3Data.state = web3Data;
        }),
        false,
        "setWeb3Data",
      ),
    resetState: () => {
      const {
        feedbackComponents: {
          actions: { showNetworkModal },
        },
      } = get();
      showNetworkModal(false);
      set(
        produce((draft: AppState) => {
          draft.web3Data.state = defaultState;
        }),
        false,
        "resetState",
      );
    },
    setAddress: (address) =>
      set(
        produce((draft: AppState) => {
          draft.web3Data.state.address = address;
        }),
        false,
        "setAddress",
      ),
    setEns: (ens) =>
      set(
        produce((draft: AppState) => {
          draft.web3Data.state.ens = ens;
        }),
        false,
        "setEns",
      ),
  },
});
