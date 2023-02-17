import { BaseProvider } from "@ethersproject/providers";
import { BigNumber } from "ethers";
import { fetchTokenPair, fetchToken, getPair } from "../helpers/pair";

jest.mock("@jones-dao/sdk", () => ({
  ...jest.requireActual("@jones-dao/sdk"),
  UniswapV2Pair__factory: {
    connect: jest.fn().mockReturnValue({
      totalSupply: jest.fn().mockReturnValue(BigNumber.from("100")),
      getReserves: jest
        .fn()
        .mockReturnValue({ reserve0: BigNumber.from("10"), reserve1: BigNumber.from("20") }),
      token0: jest.fn().mockReturnValue("0x1f6Fa7A58701b3773b08a1a16D06b656B0eCcb23"),
      token1: jest.fn().mockReturnValue("0x32Eb7902D4134bf98A28b963D26de779AF92A212"),
    }),
  },

  ERC20__factory: {
    connect: jest.fn().mockReturnValue({
      decimals: jest.fn().mockReturnValue(18),
      symbol: jest.fn().mockReturnValue("Symbol"),
    }),
  },
}));

jest.mock("../helpers/utils", () => ({
  fetchPrice: jest.fn().mockReturnValue(5),
}));

describe("Testing pair fetching", () => {
  const mockAddress = "0x0351764A06119D751A76ecdBD3956c220225DC9b";
  const mockProvider = jest.fn() as unknown as BaseProvider;

  it("Test fetchTokenPair func", async () => {
    const tokenPairInfo = await fetchTokenPair(mockAddress, mockProvider);
    expect(tokenPairInfo.totalSupply).toEqual(BigNumber.from("100"));
    expect(tokenPairInfo.reserves.reserve0).toEqual(BigNumber.from("10"));
    expect(tokenPairInfo.reserves.reserve1).toEqual(BigNumber.from("20"));
    expect(tokenPairInfo.token0Address).toEqual("0x1f6Fa7A58701b3773b08a1a16D06b656B0eCcb23");
    expect(tokenPairInfo.token1Address).toEqual("0x32Eb7902D4134bf98A28b963D26de779AF92A212");
  });

  it("Test fetchToken func", async () => {
    const tokenInfo = await fetchToken(mockAddress, mockProvider);
    expect(tokenInfo.decimals).toEqual(18);
    expect(tokenInfo.symbol).toEqual("Symbol");
  });

  it("Test getPair func", async () => {
    const pairInfo = await getPair(mockAddress, mockProvider);

    expect(pairInfo.address).toEqual(mockAddress);
    expect(pairInfo.price.toFixed(2)).toEqual("1.50");
    expect(pairInfo.totalSupply).toEqual(1e-16);

    expect(pairInfo.token0.address).toEqual("0x1f6Fa7A58701b3773b08a1a16D06b656B0eCcb23");
    expect(pairInfo.token0.symbol).toEqual("Symbol");
    expect(pairInfo.token0.decimals).toEqual(18);
    expect(pairInfo.token0.reserve).toEqual(1e-17);

    expect(pairInfo.token1.address).toEqual("0x32Eb7902D4134bf98A28b963D26de779AF92A212");
  });
});
