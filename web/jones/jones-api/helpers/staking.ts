import { BigNumber } from "ethers";

import { BaseProvider } from "@ethersproject/providers";
import {
  addresses,
  coingeckoIds,
  deprecatedFarms,
  Farm,
  FarmGeneral,
  FarmPersonal,
  farms as farmsStatic,
  FarmStatic,
  FarmV1,
  formatEtherCallback,
  isJonesToken,
  MillinerV2__factory,
  OldDepositState,
  removeDecimals,
  StakingRewards__factory,
  TokenName,
} from "@jones-dao/sdk";

import { fetchPair, fetchPrice } from "./utils";

const SECONDS_PER_YEAR = 31556952;

const farmPlaceholderValuesPersonal: FarmPersonal = {
  claimable: "0.0",
  claimableValue: 0,
  userStaked: "0.0",
  userStakedValue: 0,
  oldDeposit: "0.0",
  oldClaim: "0.0",
  oldDepositState: OldDepositState.NONE,
};

const fetchFarmV1 = async (
  provider: BaseProvider,
  farm: FarmV1,
  jonesPrice: number,
  address?: string,
): Promise<FarmV1> => {
  const { deprecatedFarmAddress, lpToken } = farm;
  const contract = StakingRewards__factory.connect(deprecatedFarmAddress, provider);
  const isSingleStaking = isJonesToken(lpToken);
  const price = isSingleStaking ? jonesPrice : (await fetchPair(lpToken)).price;
  const totalTokensLocked = removeDecimals(await contract.totalSupply());

  let personalData = {};
  if (address) {
    const [claimable, userStaked] = (await Promise.all([
      contract.earned(address),
      contract.balanceOf(address),
    ]).then(formatEtherCallback)) as [string, string];
    const claimableValue = +claimable * jonesPrice;
    const userStakedValue = +userStaked * price;

    personalData = {
      claimable,
      userStaked,
      claimableValue,
      userStakedValue,
      oldDepositState: getOldDepositState(userStaked, claimable),
    };
  }

  return {
    ...farm,
    ...personalData,
    tvl: totalTokensLocked * price,
  };
};

export const getFarmsV1Tvl = async (provider: BaseProvider): Promise<number> => {
  const v1Farms = [...farmsStatic, ...deprecatedFarms].filter(
    (farm) => farm.deprecatedFarmAddress,
  ) as FarmV1[]; // if prop deprecatedFarmAddress is defined, it's safe to cast, since we don't use prop poolId
  const jonesPrice = await fetchPrice(coingeckoIds[addresses.tokens.JONES]);
  const individualTvl = await Promise.all(
    v1Farms.map((farm) => fetchFarmV1(provider, farm, jonesPrice)),
  );
  const totalTvl = individualTvl.reduce((acc, curr) => acc + (curr.tvl ?? 0), 0);
  return totalTvl;
};

export const getFarmsDeprecated = async (
  provider: BaseProvider,
  address: string,
): Promise<FarmV1[]> => {
  const jonesPrice = await fetchPrice(coingeckoIds[addresses.tokens.JONES]);

  const deprecatedFarmsData = await Promise.all(
    deprecatedFarms.map(async (farm) => fetchFarmV1(provider, farm, jonesPrice, address)),
  );

  return deprecatedFarmsData;
};

export const getFarmsGeneral = async (provider: BaseProvider): Promise<Farm[]> => {
  const farmContract = MillinerV2__factory.connect(addresses.MILLINER, provider);

  const poolInfoPromises = Promise.all(
    farmsStatic.map(({ poolId }) => farmContract.poolInfo(poolId)),
  );

  const [totalAllocPoint, jonesPerSecondWei, poolInfoArray, jonesPrice] = await Promise.all([
    farmContract.totalAllocPoint(),
    farmContract.jonesPerSecond(),
    poolInfoPromises,
    fetchPrice(coingeckoIds[addresses.tokens.JONES]),
  ]);

  const farms: Farm[] = await Promise.all(
    farmsStatic.map(async (staticFarm) => {
      const poolInfo = poolInfoArray.find(({ lpToken }) => lpToken === staticFarm.lpToken);
      if (!poolInfo)
        return {
          ...staticFarm,
          buyUrl: "",
          totalStaked: 0,
          totalStakedValue: 0,
          apr: 0,
          deprecatedFarmTotalStakedValue: 0,
        };

      const farmGeneral = await fetchFarmGeneral({
        ...poolInfo,
        ...staticFarm,
        totalAllocPoint,
        jonesPerSecondWei,
        jonesPrice,
        provider,
      });

      const farm: Farm = {
        ...staticFarm,
        ...farmGeneral,
      };

      return farm;
    }),
  );

  return farms;
};

const fetchFarmGeneral = async ({
  lpToken,
  currentDeposit,
  allocPoint,
  totalAllocPoint,
  jonesPerSecondWei,
  jonesPrice,
  provider,
  ...staticFarm
}: {
  lpToken: string;
  allocPoint: BigNumber;
  currentDeposit: BigNumber;
  totalAllocPoint: BigNumber;
  jonesPerSecondWei: BigNumber;
  jonesPrice: number;
  provider: BaseProvider;
} & Partial<FarmStatic>): Promise<FarmGeneral> => {
  const { isSingleStaking, deprecatedFarmAddress } = staticFarm;

  let tokenPrice;
  let buyUrl;
  let deprecatedFarmTotalStakedValue = 0;

  if (isSingleStaking) {
    tokenPrice = jonesPrice;
    buyUrl = `https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=${lpToken}`;
  } else {
    const { token0, token1, price } = await fetchPair(lpToken);
    tokenPrice = price;

    const getTokenUrlParam = (address: string): string =>
      address === addresses.tokens[TokenName.ETH] ? TokenName.ETH : address;

    buyUrl = `https://app.sushi.com/add/${getTokenUrlParam(token0.address)}/${getTokenUrlParam(
      token1.address,
    )}`;
  }

  if (deprecatedFarmAddress) {
    const oldFarmContract = StakingRewards__factory.connect(deprecatedFarmAddress, provider);
    const totalTokensLocked = removeDecimals(await oldFarmContract.totalSupply());
    deprecatedFarmTotalStakedValue = totalTokensLocked * tokenPrice;
  }

  const totalStaked = removeDecimals(currentDeposit);
  const allocationShare = +allocPoint / +totalAllocPoint;
  const jonesPerYearByAlloc =
    removeDecimals(jonesPerSecondWei) * SECONDS_PER_YEAR * allocationShare;
  const totalStakedValue = totalStaked * tokenPrice;
  const apr = ((jonesPrice * jonesPerYearByAlloc) / (tokenPrice * totalStaked)) * 100;

  return {
    buyUrl,
    totalStaked,
    totalStakedValue,
    apr,
    deprecatedFarmTotalStakedValue,
  };
};

export const getFarmsPersonal = async (
  provider: BaseProvider,
  address: string,
): Promise<FarmPersonal[]> => {
  const jonesPrice = await fetchPrice(coingeckoIds[addresses.tokens.JONES]);

  const farms: FarmPersonal[] = await Promise.all(
    farmsStatic.map(async (staticFarm) => {
      const { poolId, deprecatedFarmAddress, lpToken } = staticFarm;
      const farmPersonal = await fetchFarmPersonal({
        poolId,
        address,
        lpToken,
        deprecatedFarmAddress,
        jonesPrice,
        provider,
      });

      return { ...staticFarm, ...farmPersonal };
    }),
  );

  return farms;
};

const fetchFarmPersonal = async ({
  poolId,
  address,
  lpToken,
  deprecatedFarmAddress,
  jonesPrice,
  provider,
}: {
  poolId: string;
  address: string;
  lpToken: string;
  deprecatedFarmAddress: string | undefined;
  jonesPrice: number;
  provider: BaseProvider;
}): Promise<FarmPersonal> => {
  try {
    const contract = MillinerV2__factory.connect(addresses.MILLINER, provider);
    let oldDeposit = "0";
    let oldClaim = "0";

    if (deprecatedFarmAddress) {
      const oldFarmContract = StakingRewards__factory.connect(deprecatedFarmAddress, provider);
      [oldDeposit, oldClaim] = await Promise.all([
        oldFarmContract.balanceOf(address),
        oldFarmContract.earned(address),
      ]).then(formatEtherCallback);
    }

    const isSingleStaking = isJonesToken(lpToken);

    const [claimable, userStaked] = (await Promise.all([
      contract.pendingJones(poolId, address),
      contract.deposited(poolId, address),
    ]).then(formatEtherCallback)) as [string, string];

    let tokenPrice, tokenPair;

    if (isSingleStaking) {
      tokenPrice = jonesPrice;
    } else {
      const { token0, token1, price, totalSupply } = await fetchPair(lpToken);
      tokenPrice = price;
      tokenPair = {
        token0: {
          symbol: token0.symbol,
          staked: (+userStaked * token0.reserve) / totalSupply,
        },
        token1: {
          symbol: token1.symbol,
          staked: (+userStaked * token1.reserve) / totalSupply,
        },
      };
    }

    return {
      claimable,
      claimableValue: +claimable * jonesPrice,
      userStaked,
      userStakedValue: +userStaked * tokenPrice,
      tokenPair,
      oldDeposit,
      oldClaim,
      oldDepositState: getOldDepositState(oldDeposit, oldClaim),
    };
  } catch (err) {
    console.error(err);
    return farmPlaceholderValuesPersonal;
  }
};

const getOldDepositState = (staked: string, claimable: string): OldDepositState => {
  if (+staked + +claimable) {
    if (!+staked) return OldDepositState.CLAIM;
    if (!+claimable) return OldDepositState.DEPOSIT;
    return OldDepositState.DEPOSIT_CLAIM;
  }
  return OldDepositState.NONE;
};

export const fetchSingleFarm = async (
  provider: BaseProvider,
  address: string | undefined,
  poolId: string,
) => {
  const farmContract = MillinerV2__factory.connect(addresses.MILLINER, provider);

  const [totalAllocPoint, jonesPerSecondWei, poolInfo, jonesPrice] = await Promise.all([
    farmContract.totalAllocPoint(),
    farmContract.jonesPerSecond(),
    farmContract.poolInfo(poolId),
    fetchPrice(coingeckoIds[addresses.tokens.JONES]),
  ]);

  const staticFarm = farmsStatic.find(({ lpToken }) => lpToken === poolInfo.lpToken);

  const generalData = await fetchFarmGeneral({
    ...poolInfo,
    ...staticFarm,
    totalAllocPoint,
    jonesPerSecondWei,
    jonesPrice,
    provider,
  });

  const personalData = address
    ? await fetchFarmPersonal({
        poolId,
        address,
        lpToken: poolInfo.lpToken,
        deprecatedFarmAddress: staticFarm?.deprecatedFarmAddress,
        jonesPrice,
        provider,
      })
    : farmPlaceholderValuesPersonal;

  return {
    ...staticFarm,
    ...generalData,
    ...personalData,
  };
};
