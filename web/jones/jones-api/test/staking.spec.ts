import { constants } from "ethers";

import { BaseProvider } from "@ethersproject/providers";
import { deprecatedFarms, farms as staticFarmsData } from "@jones-dao/sdk";

import {
  fetchSingleFarm,
  getFarmsDeprecated,
  getFarmsGeneral,
  getFarmsPersonal,
  getFarmsV1Tvl,
} from "../helpers/staking";

jest.mock("../helpers/utils", () => ({
  ...jest.requireActual("../helpers/utils"),
  fetchPrice: jest.fn().mockReturnValue(5),
  fetchPair: jest.fn().mockReturnValue({
    address: "0x110a0f39b15D04f2F348B61Bd741429C7d188d3F",
    price: 80,
    token0: {
      address: "0x1f6Fa7A58701b3773b08a1a16D06b656B0eCcb23",
      symbol: "jrDPX",
      decimals: 18,
      reserve: 7370.062101643418,
    },
    token1: {
      address: "0x32Eb7902D4134bf98A28b963D26de779AF92A212",
      symbol: "RDPX",
      decimals: 18,
      reserve: 7855.928489475249,
    },
  }),
}));

jest.mock("@jones-dao/sdk", () => ({
  ...jest.requireActual("@jones-dao/sdk"),
  StakingRewards__factory: {
    connect: jest.fn().mockReturnValue({
      totalSupply: jest.fn().mockReturnValue(constants.WeiPerEther),
      earned: jest.fn().mockReturnValue(constants.WeiPerEther),
      balanceOf: jest.fn().mockReturnValue(constants.WeiPerEther),
    }),
  },
  MillinerV2__factory: {
    connect: jest.fn().mockReturnValue({
      poolInfo: jest.fn().mockReturnValue({
        lpToken: "0x110a0f39b15D04f2F348B61Bd741429C7d188d3F",
        allocPoint: 100,
        currentDeposit: constants.WeiPerEther,
      }),
      totalAllocPoint: jest.fn().mockReturnValue(constants.WeiPerEther),
      jonesPerSecond: jest.fn().mockReturnValue(constants.WeiPerEther),
      pendingJones: jest.fn().mockReturnValue(constants.WeiPerEther),
      deposited: jest.fn().mockReturnValue(constants.WeiPerEther),
    }),
  },
}));

describe("Farms", () => {
  const mockProvider = jest.fn() as unknown as BaseProvider;
  const mockAddress = "0x0351764A06119D751A76ecdBD3956c220225DC9b";

  it("Gets total tvl for V1 farms", async () => {
    const tvl = await getFarmsV1Tvl(mockProvider);
    expect(tvl).toBe(405);
  });

  it("Gets data from deprecated farms", async () => {
    const deprecatedFarmsRes = await getFarmsDeprecated(mockProvider, mockAddress);
    const deprecatedFarmsStaticData = Object.values(deprecatedFarms);
    const mockRes = {
      tvl: 80,
      claimable: "1.0",
      userStaked: "1.0",
      claimableValue: 5,
      userStakedValue: 80,
      oldDepositState: 3,
    };

    for (let i = 0; i < deprecatedFarmsStaticData.length; i++) {
      expect(deprecatedFarmsRes[i]).toEqual({ ...deprecatedFarmsStaticData[i], ...mockRes });
    }
  });

  it("Gets general farms data", async () => {
    const farms = await getFarmsGeneral(mockProvider);
    const farmsStatic = Object.values(staticFarmsData);

    expect(farms.length).toBe(farmsStatic.length);
    expect(farms[5]).toEqual({
      farmName: "jRDPX-RDPX",
      poolId: "5",
      deprecatedFarmAddress: undefined,
      lpToken: "0x110a0f39b15D04f2F348B61Bd741429C7d188d3F",
      buyUrl:
        "https://app.sushi.com/add/0x1f6Fa7A58701b3773b08a1a16D06b656B0eCcb23/0x32Eb7902D4134bf98A28b963D26de779AF92A212",
      totalStaked: 1,
      totalStakedValue: 80,
      apr: 1.9723094999999998e-8,
      deprecatedFarmTotalStakedValue: 0,
    });
  });

  it("Gets personal farms data", async () => {
    const farms = await getFarmsPersonal(mockProvider, mockAddress);
    const farmsStatic = Object.values(staticFarmsData);

    expect(farms.length).toBe(farmsStatic.length);
    expect(farms[0]).toEqual({
      farmName: "JONES",
      poolId: "0",
      deprecatedFarmAddress: "0xf1a26Cf6309a59794da29B5b2E6fABD3070d470f",
      claimable: "1.0",
      claimableValue: 5,
      userStaked: "1.0",
      userStakedValue: 5,
      tokenPair: undefined,
      oldDeposit: "1.0",
      oldClaim: "1.0",
      oldDepositState: 3,
      isSingleStaking: true,
      lpToken: "0x10393c20975cF177a3513071bC110f7962CD67da",
    });
  });

  it("Gets a signel farm", async () => {
    const farm = await fetchSingleFarm(mockProvider, mockAddress, "0");

    expect(farm).toEqual({
      farmName: "jRDPX-RDPX",
      poolId: "5",
      deprecatedFarmAddress: undefined,
      lpToken: "0x110a0f39b15D04f2F348B61Bd741429C7d188d3F",
      buyUrl:
        "https://app.sushi.com/add/0x1f6Fa7A58701b3773b08a1a16D06b656B0eCcb23/0x32Eb7902D4134bf98A28b963D26de779AF92A212",
      totalStaked: 1,
      totalStakedValue: 80,
      apr: 1.9723094999999998e-8,
      deprecatedFarmTotalStakedValue: 0,
      claimable: "1.0",
      claimableValue: 5,
      userStaked: "1.0",
      userStakedValue: 80,
      tokenPair: {
        token0: { symbol: "jrDPX", staked: NaN },
        token1: { symbol: "RDPX", staked: NaN },
      },
      oldDeposit: "0",
      oldClaim: "0",
      oldDepositState: 0,
    });
  });
});
