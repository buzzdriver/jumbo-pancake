import { BaseProvider } from "@ethersproject/providers";
import { indexClaimed } from "../helpers/airdrop";

jest.mock("@jones-dao/sdk", () => ({
  ...jest.requireActual("@jones-dao/sdk"),
  JonesAirdrop__factory: {
    connect: jest.fn().mockReturnValue({
      isClaimed: jest.fn().mockReturnValue(true),
    }),
  },
}));

describe("Airdrop", () => {
  const mockProvider = jest.fn() as unknown as BaseProvider;

  it("check indexClaimed function", async () => {
    const isClaimed = await indexClaimed(0, mockProvider);
    expect(isClaimed).toBe(true);
  });
});
