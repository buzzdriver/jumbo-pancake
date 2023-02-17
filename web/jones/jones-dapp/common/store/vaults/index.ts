import { Vault, VaultName } from "@jones-dao/sdk";
import produce from "immer";
import { GetState } from "zustand";
import { NamedSet } from "zustand/middleware";

import { AppState } from "../";
import config from "../../config";
import { fetchUrl } from "../../utils/queries";

export interface VaultState {
  vaults: Vault[];
  vaultsTvl: number;
  loading: boolean;
  userDataLoading: boolean;
}

interface VaultActions {
  getVaultsGeneral: () => void;
  getVaultsPersonal: () => void;
  getSingleVault: (vaultAddress: string) => void;
}

export interface Vaults {
  state: VaultState;
  actions: VaultActions;
}

const defaultState: VaultState = {
  vaults: [],
  vaultsTvl: 0,
  loading: false,
  userDataLoading: false,
};

export const vaultSlice = (set: NamedSet<AppState>, get: GetState<AppState>): Vaults => {
  const setLoading = (loading: boolean) => {
    set(
      produce((draft: AppState) => {
        draft.vaults.state.loading = loading;
      }),
      false,
      "vaults/setLoading",
    );
  };

  const setUserDataLoading = (userDataLoading: boolean) => {
    set(
      produce((draft: AppState) => {
        draft.vaults.state.userDataLoading = userDataLoading;
      }),
      false,
      "vaults/setUserDataLoading",
    );
  };

  const calculateApy = (vaultName: VaultName): number => {
    const roiList = Object.values(config.vaultData[vaultName].roi);
    const avgRoi = roiList.reduce((a, b) => a + b) / roiList.length / 100;
    return ((1 + avgRoi) ** 12 - 1) * 100;
  };

  const calculatePreviousEpochApy = (vaultName: VaultName): number => {
    const roiList = Object.values(config.vaultData[vaultName].roi);
    return ((1 + roiList[roiList.length - 1] / 100) ** 12 - 1) * 100;
  };

  return {
    state: defaultState,
    actions: {
      getVaultsGeneral: async () => {
        const {
          web3Data: {
            state: { address, isSupportedChain },
          },
        } = get();

        const shouldFetch = !address || isSupportedChain;
        if (!shouldFetch) return;

        setLoading(true);

        const { vaults } = await fetchUrl<{ vaults: Vault[] }>(
          config.apiUrl + "/v1/jones/vaults/general",
        );
        const vaultsWithApy = vaults.map((vault) => ({
          ...vault,
          apy: calculateApy(vault.vaultName),
          prevEpochApy: calculatePreviousEpochApy(vault.vaultName),
          maxDrawdown: config.vaultData[vault.vaultName].maxDrawdown,
        }));

        set(
          produce((draft: AppState) => {
            draft.vaults.state.vaults = vaultsWithApy;
            draft.vaults.state.vaultsTvl = vaultsWithApy.reduce((acc, { tvl = 0 }) => {
              acc += tvl;
              return acc;
            }, 0);
          }),
          false,
          "getVaultsGeneral",
        );

        setLoading(false);
      },

      getVaultsPersonal: async () => {
        const {
          web3Data: {
            state: { address },
          },
        } = get();

        setUserDataLoading(true);

        const { vaults } = await fetchUrl<{ vaults: Vault[] }>(
          config.apiUrl + "/v1/jones/vaults/personal/" + address,
        );

        set(
          produce((draft: AppState) => {
            draft.vaults.state.vaults = draft.vaults.state.vaults.map((v) => {
              const sameVault = vaults.find(({ vaultName }) => v.vaultName === vaultName);
              if (sameVault) {
                return {
                  ...sameVault,
                  ...v,
                };
              } else {
                console.error(`Vault not found ${v.vaultName}`);
                return v;
              }
            });
          }),
          false,
          "getVaultsPersonal",
        );

        setUserDataLoading(false);
      },

      getSingleVault: async (vaultName: string) => {
        const {
          web3Data: {
            state: { address },
          },
        } = get();

        setUserDataLoading(true);

        const { vault } = await fetchUrl<{ vault: Vault }>(
          `${config.apiUrl}/v1/jones/vault/${vaultName}?address=${address}`,
        );
        const vaultWithApy = {
          ...vault,
          apy: calculateApy(vault.vaultName),
          prevEpochApy: calculatePreviousEpochApy(vault.vaultName),
          maxDrawdown: config.vaultData[vault.vaultName].maxDrawdown,
        };

        set(
          produce((draft: AppState) => {
            draft.vaults.state.vaults = draft.vaults.state.vaults.map((stateVault) =>
              stateVault.vaultName === vaultName ? vaultWithApy : stateVault,
            );
          }),
          false,
          "fetchVaultPersonal",
        );

        setUserDataLoading(false);
      },
    },
  };
};
