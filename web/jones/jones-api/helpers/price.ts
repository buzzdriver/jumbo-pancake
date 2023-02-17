import fetch from "node-fetch";

import { coingeckoIds } from "@jones-dao/sdk";

interface CoingeckoResponse {
  [tokenId: string]: { usd: number };
}

export const getPrice = async (tokenSymbol: string): Promise<{ usd: number } | undefined> => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${tokenSymbol}&vs_currencies=usd`,
  );

  const jsonPrice: CoingeckoResponse = await response.json();

  return jsonPrice[tokenSymbol];
};

export const getPrices = async (
  tokenIds: string | string[],
): Promise<{ [tokenId: string]: number }> => {
  const ids = Array.isArray(tokenIds) ? tokenIds.join(",") : tokenIds;
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
  );
  const jsonPrice: CoingeckoResponse = await response.json();
  const priceObject: { [tokenId: string]: number } = {};
  Object.entries(jsonPrice).forEach(([key, value]) => {
    priceObject[key] = value["usd"];
  });

  return priceObject;
};

export const getMarketPrices = async (): Promise<{ [tokenId: string]: number }> => {
  const tokenIds = Object.values(coingeckoIds);
  return getPrices(tokenIds);
};
