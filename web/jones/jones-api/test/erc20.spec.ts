import { constants } from "ethers";
import { parseEther } from "ethers/lib/utils";

import { BaseProvider } from "@ethersproject/providers";

import { getAllowance, getEthBalance, getTokenBalance } from "../helpers/erc20";

jest.mock("@jones-dao/sdk", () => ({
  ...jest.requireActual("@jones-dao/sdk"),
  ERC20__factory: {
    connect: jest.fn().mockReturnValue({
      allowance: jest.fn().mockReturnValue(constants.WeiPerEther),
      balanceOf: jest.fn().mockReturnValue(constants.WeiPerEther),
    }),
  },
}));

describe("erc20", () => {
  const mockProvider = {
    getBalance: () => parseEther("1"),
  } as unknown as BaseProvider;
  const mockAddress = "0x0351764A06119D751A76ecdBD3956c220225DC9b";
  const mockTokenAddress = "0x10393c20975cF177a3513071bC110f7962CD67da";
  const mockSpenderAddress = "0xf1a26Cf6309a59794da29B5b2E6fABD3070d470f";

  it("gets eth balance", async () => {
    const balance = await getEthBalance(mockAddress, mockProvider);
    expect(balance).toBe("1.0");
  });

  it("gets token balance", async () => {
    const balance = await getTokenBalance(mockTokenAddress, mockAddress, mockProvider);
    expect(balance).toBe("1.0");
  });

  it("gets token allowance", async () => {
    const balance = await getAllowance(
      mockTokenAddress,
      mockAddress,
      mockSpenderAddress,
      mockProvider,
    );
    expect(balance).toBe("1.0");
  });
});
