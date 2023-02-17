import { constants, BigNumber } from "ethers/lib/ethers";

import { BaseProvider } from "@ethersproject/providers";
import { userAlreadyClaimed } from "../helpers/tokenSale";

jest.mock("@jones-dao/sdk", () => ({
  ...jest.requireActual("@jones-dao/sdk"),
  JonesSaleClaim__factory: {
    connect: jest.fn().mockReturnValue({
      claims: jest.fn().mockReturnValue(BigNumber.from(1)),
    }),
  },
  JonesTokenSaleV3__factory: {
    connect: jest.fn().mockReturnValue({
      claimAmountEth: jest.fn().mockReturnValue(BigNumber.from(10).mul(constants.WeiPerEther)),
      claimAmountJones: jest.fn().mockReturnValue(BigNumber.from(5).mul(constants.WeiPerEther)),
    }),
  },
}));

describe("Sales", () => {
  const mockProvider = jest.fn() as unknown as BaseProvider;
  const mockAddress = "0x0351764A06119D751A76ecdBD3956c220225DC9b";

  it("check userAlreadyClaimed function", async () => {
    const { userEthClaimable, userJonesClaimable, userClaimed } = await userAlreadyClaimed(
      mockAddress,
      mockProvider,
    );
    expect(userEthClaimable).toBe(10);
    expect(userJonesClaimable).toBe(5);
    expect(userClaimed).toBe(true);
  });
});
