import { constants } from "ethers";

import { BaseProvider } from "@ethersproject/providers";

import { getVaultsGeneral, getVaultsPersonal } from "../helpers/vaults";

jest.mock("@jones-dao/sdk", () => ({
  ...jest.requireActual("@jones-dao/sdk"),
  JonesERC20VaultV3__factory: {
    connect: jest.fn().mockReturnValue({
      state: jest.fn().mockReturnValue(0),
      vaultCap: jest.fn().mockReturnValue(constants.WeiPerEther),
      convertToShares: jest.fn().mockReturnValue(constants.WeiPerEther),
      convertToAssets: jest.fn().mockReturnValue(constants.WeiPerEther),
      snapshotAssetBalance: jest.fn().mockReturnValue(constants.WeiPerEther),
      maxWithdraw: jest.fn().mockReturnValue(constants.WeiPerEther),
    }),
  },
}));

jest.mock("../helpers/utils", () => ({
  ...jest.requireActual("../helpers/utils"),
  fetchPrice: jest.fn().mockReturnValue(5),
}));

describe("Vaults", () => {
  const mockProvider = jest.fn() as unknown as BaseProvider;
  const mockAddress = "0x0351764A06119D751A76ecdBD3956c220225DC9b";

  describe("V3", () => {
    it("Gets general vault data", async () => {
      const vaults = await getVaultsGeneral(mockProvider);
      expect(vaults.length).toBe(4);
      expect(vaults[0]).toEqual({
        vaultName: "ETH",
        tokenAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        jAssetAddress: "0x662d0f9Ff837A51cF89A1FE7E0882a906dAC08a3",
        jAssetPictureUrl:
          "https://gateway.pinata.cloud/ipfs/Qmc6wdeX9Syym23LzsimKBDEVZvvjPYEm9ZPtCfWdJJQN6",
        version: "V3",
        vaultAddress: "0xF46Ce0C13577232D5F29D9Bd78a9Cab278755346",
        isCapSet: true,
        managementWindowOpen: true,
        isNativeVault: true,
        vaultCap: 1,
        tvl: 5,
        totalDeposited: 1,
        percentageFilled: 100,
        jAssetPerToken: 1,
        tokenPerJAsset: 1,
      });
    });

    it("Gets personal vaults data", async () => {
      const vaults = await getVaultsPersonal(mockProvider, mockAddress);
      expect(vaults.length).toBe(4);
      expect(vaults[0]).toEqual({
        vaultName: "ETH",
        vaultAddress: "0xF46Ce0C13577232D5F29D9Bd78a9Cab278755346",
        tokenAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        jAssetAddress: "0x662d0f9Ff837A51cF89A1FE7E0882a906dAC08a3",
        jAssetPictureUrl:
          "https://gateway.pinata.cloud/ipfs/Qmc6wdeX9Syym23LzsimKBDEVZvvjPYEm9ZPtCfWdJJQN6",
        version: "V3",
        isNativeVault: true,
        isCapSet: false,
        managementWindowOpen: false,
        vaultCap: 0,
        tvl: 0,
        totalDeposited: 0,
        percentageFilled: 0,
        jAssetPerToken: 1,
        tokenPerJAsset: 1,
        userClaimable: "1.0",
      });
    });
  });
});
