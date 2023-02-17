import { BigNumber } from "ethers";

import { BaseProvider } from "@ethersproject/providers";
import {
  coingeckoIds,
  ERC20__factory,
  removeDecimals,
  TokenName,
  UniswapV2Pair__factory,
} from "@jones-dao/sdk";

import { fetchPrice } from "./utils";

interface PairToken {
  symbol: string;
  address: string;
  reserve: number;
  decimals: number;
}
export interface Pair {
  address: string;
  price: number;
  totalSupply: number;
  token0: PairToken;
  token1: PairToken;
}

export const fetchTokenPair = async (
  lpToken: string,
  provider: BaseProvider,
): Promise<{
  totalSupply: BigNumber;
  reserves: { reserve0: BigNumber; reserve1: BigNumber };
  token0Address: string;
  token1Address: string;
}> => {
  const pairContract = UniswapV2Pair__factory.connect(lpToken, provider);

  const [totalSupply, reserves, token0Address, token1Address] = await Promise.all([
    pairContract.totalSupply(),
    pairContract.getReserves(),
    pairContract.token0(),
    pairContract.token1(),
  ]);

  return {
    totalSupply,
    reserves,
    token0Address,
    token1Address,
  };
};

export const fetchToken = async (
  tokenAddress: string,
  provider: BaseProvider,
): Promise<{ decimals: number; symbol: string }> => {
  const tokenContract = ERC20__factory.connect(tokenAddress, provider);
  const [decimals, symbol] = await Promise.all([tokenContract.decimals(), tokenContract.symbol()]);
  return { decimals, symbol };
};

export const getPair = async (lpToken: string, provider: BaseProvider): Promise<Pair> => {
  const {
    totalSupply: totalSupplyWei,
    reserves,
    token0Address,
    token1Address,
  } = await fetchTokenPair(lpToken, provider);
  const [token0Info, token1Info] = await Promise.all([
    fetchToken(token0Address, provider),
    fetchToken(token1Address, provider),
  ]);

  const adjustSymbol = (symbol: string): string => (symbol === "WETH" ? TokenName.ETH : symbol);

  const token0 = {
    address: token0Address,
    symbol: adjustSymbol(token0Info.symbol),
    decimals: token0Info.decimals,
    reserve: removeDecimals(reserves.reserve0, token0Info.decimals),
  };
  const token1 = {
    address: token1Address,
    symbol: adjustSymbol(token1Info.symbol),
    decimals: token1Info.decimals,
    reserve: removeDecimals(reserves.reserve1, token1Info.decimals),
  };

  const [token0Price, token1Price] = await Promise.all([
    fetchPrice(coingeckoIds[token0Address]),
    fetchPrice(coingeckoIds[token1Address]),
  ]);

  const token0TotalUsd = token0.reserve * token0Price;
  const token1TotalUsd = token1.reserve * token1Price;
  const totalUsdValue = token0TotalUsd + token1TotalUsd;
  const totalSupply = removeDecimals(totalSupplyWei);
  let price = totalUsdValue / totalSupply;

  // some pools don't have their counterpart available on coingecko
  if (!token0Price || !token1Price) {
    price = price * 2;
  }

  return {
    address: lpToken,
    price,
    totalSupply,
    token0,
    token1,
  };
};
