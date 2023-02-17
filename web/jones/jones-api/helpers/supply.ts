import {
  addresses,
  ERC20__factory,
  PairName,
  removeDecimals,
  StakingRewards__factory,
  TokenName,
} from "@jones-dao/sdk";

import { getProvider } from "./providers";

export const getJonesCirculatingSupply = async (): Promise<number> => {
  const provider = getProvider();

  const jonesTokenArb = ERC20__factory.connect(addresses.tokens.JONES, provider);

  const jonesStakingRewards = StakingRewards__factory.connect(
    addresses.stakingRewards[TokenName.JONES],
    provider,
  );

  const supplyData = {
    sale: {
      address: addresses.PUBLIC_SALE_CLAIM,
      allocation: 1700000,
    },
    teamVesting: {
      address: addresses.TEAM_VESTING,
      allocation: 1201826,
    },
    jonesFarm: {
      address: addresses.stakingRewards[TokenName.JONES],
      allocation: 54600,
      reduceBalance: jonesStakingRewards.totalSupply,
    },
    jonesEthFarm: {
      address: addresses.stakingRewards[PairName.JONES_ETH],
      allocation: 136500,
    },
    jonesUsdcFarm: {
      address: addresses.stakingRewards[PairName.JONES_USDC],
      allocation: 97500,
    },
    jEthEthFarm: {
      address: addresses.stakingRewards[PairName.JETH_ETH],
      allocation: 31200,
    },
    jGohmGohmFarm: {
      address: addresses.stakingRewards[PairName.JGOHM_GOHM],
      allocation: 31200,
    },
    jDpxDpxFarm: {
      address: addresses.stakingRewards[PairName.JDPX_DPX],
      allocation: 22400,
    },
    airdrop: {
      address: addresses.AIRDROP,
      allocation: 100000,
    },
    seedVesting: {
      address: addresses.SEED_VESTING,
      allocation: 967116,
    },
    hatDistribution: {
      address: addresses.HAT_DISTRIBUTION,
      allocation: 143600 + 136000,
    },
    contributorVesting: {
      address: addresses.CONTRIBUTOR_VESTING,
      allocation: 145325,
    },
  };

  const OLYMPUS_DONATION_EMITTED = 330000;

  const circulatingSupply = (
    await Promise.all(
      Object.values(supplyData).map(async (data) => {
        const { allocation, address } = data;
        const balance = removeDecimals(await jonesTokenArb.balanceOf(address || ""));
        if ("reduceBalance" in data) {
          const reduce = removeDecimals(await data.reduceBalance());
          return allocation - (balance - reduce);
        }

        return allocation - balance;
      }),
    )
  ).reduce((acc, curr) => acc + curr, OLYMPUS_DONATION_EMITTED);

  return circulatingSupply;
};
