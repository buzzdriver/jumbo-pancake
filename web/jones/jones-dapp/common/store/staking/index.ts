import { Farm, FarmV1, OldDepositState } from "@jones-dao/sdk";
import produce from "immer";
import { GetState } from "zustand";
import { NamedSet } from "zustand/middleware";

import { AppState } from "../";
import config from "../../config";
import { fetchUrl } from "../../utils/queries";

export interface FarmsState {
  farms: Farm[];
  farmsTvl: number;
  userHasOldDeposit: boolean;
  farmsLoading: boolean;
  farmsUserDataLoading: boolean;
  deprecatedFarms: FarmV1[];
}

interface FarmsActions {
  getFarmsGeneral: () => void;
  getFarmsPersonal: () => void;
  getSingleFarm: (poolId: string) => void;
}

export interface FarmsSlice {
  state: FarmsState;
  actions: FarmsActions;
}

const defaultState: FarmsState = {
  farms: [],
  deprecatedFarms: [],
  farmsTvl: 0,
  userHasOldDeposit: false,
  farmsLoading: false,
  farmsUserDataLoading: false,
};

export const farmsSlice = (set: NamedSet<AppState>, get: GetState<AppState>): FarmsSlice => ({
  state: defaultState,
  actions: {
    getFarmsGeneral: async () => {
      const setLoading = (loading: boolean) => {
        set(
          produce((draft: AppState) => {
            draft.staking.state.farmsLoading = loading;
          }),
          false,
          "staking/setLoading",
        );
      };

      const {
        web3Data: {
          state: { address, isSupportedChain },
        },
      } = get();

      const shouldFetch = !address || isSupportedChain;
      if (!shouldFetch) return;

      setLoading(true);

      const { farms } = await fetchUrl<{ farms: Farm[] }>(
        config.apiUrl + "/v1/jones/farms/general",
      );

      set(
        produce((draft: AppState) => {
          draft.staking.state.farms = farms;
          draft.staking.state.farmsTvl = farms.reduce((acc, curr) => {
            acc += curr.totalStakedValue ?? 0;
            acc += curr.deprecatedFarmTotalStakedValue ?? 0;
            return acc;
          }, 0);
        }),
        false,
        "getFarmsGeneral",
      );

      setLoading(false);
    },
    getFarmsPersonal: async () => {
      const setUserDataLoading = (userDataLoading: boolean) => {
        set(
          produce((draft: AppState) => {
            draft.staking.state.farmsUserDataLoading = userDataLoading;
          }),
          false,
          "staking/setUserDataLoading",
        );
      };

      setUserDataLoading(true);

      const {
        web3Data: {
          state: { address },
        },
        staking: {
          state: { farms },
        },
      } = get();

      if (!address) {
        setUserDataLoading(false);
        return console.error("No address found");
      }

      const sortFarms = (a: { poolId: string }, b: { poolId: string }) => +a.poolId - +b.poolId;

      const [farmsPersonal, farmsDeprecated] = await Promise.all([
        fetchUrl<{ farms: Farm[] }>(config.apiUrl + "/v1/jones/farms/personal/" + address),
        fetchUrl<{ deprecatedFarms: FarmV1[] }>(
          config.apiUrl + "/v1/jones/farms/deprecated/" + address,
        ),
      ]);

      const farmsPersonalDataSorted = farmsPersonal.farms.sort(sortFarms);
      const farmsFilled = farms
        .slice()
        .sort(sortFarms)
        .map((f, i) => ({ ...f, ...farmsPersonalDataSorted[i] }));

      const userHasOldDeposit = farmsFilled.some((f) => f.oldDepositState !== OldDepositState.NONE);

      const deprecatedFarmsFiltered = farmsDeprecated.deprecatedFarms.filter(
        ({ userStaked }) => Number(userStaked) > 0,
      );

      set(
        produce((draft: AppState) => {
          draft.staking.state.userHasOldDeposit = userHasOldDeposit;
          draft.staking.state.farms = farmsFilled;
          draft.staking.state.deprecatedFarms = deprecatedFarmsFiltered;
        }),
        false,
        "getFarmsPersonal",
      );

      setUserDataLoading(false);
    },
    getSingleFarm: async (poolId: string) => {
      const {
        web3Data: {
          state: { address },
        },
      } = get();

      const { farm } = await fetchUrl<{ farm: Farm }>(
        config.apiUrl + "/v1/jones/farm/" + poolId + "?address=" + address,
      );

      set(
        produce((draft: AppState) => {
          const currentFarmIndex = draft.staking.state.farms.findIndex((f) => f.poolId === poolId);
          if (currentFarmIndex === -1) {
            console.error(`Farm with poolId ${poolId} not found`);
          } else {
            draft.staking.state.userHasOldDeposit =
              draft.staking.state.userHasOldDeposit || Number(farm.oldDeposit) > 0;
            draft.staking.state.farms[currentFarmIndex] = farm;
            draft.staking.state.farmsTvl = draft.staking.state.farms.reduce((acc, curr) => {
              acc += curr.totalStakedValue ?? 0;
              acc += curr.deprecatedFarmTotalStakedValue ?? 0;
              return acc;
            }, 0);
          }
        }),
        false,
        "getSingleFarm",
      );
    },
  },
});
