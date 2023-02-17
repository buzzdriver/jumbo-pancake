import fetch from "node-fetch";

import { Farm, Vault } from "@jones-dao/sdk";

import config from "./config";
import { Pair } from "./pair";

const fetchOwn = async <T>(path: string): Promise<T> => {
  const res: T = await fetch(config.apiUrl + path).then((r) => r.json());
  return res;
};

export const fetchPrice = async (id: string | undefined): Promise<number> => {
  if (!id) return 0;
  const priceRes = await fetchOwn<{ price: { usd: number } }>(`/v1/price/${id}`);
  return priceRes.price.usd;
};
export const fetchMarketPrices = async (): Promise<Record<string, number>> => {
  const pricesRes = await fetchOwn<{ prices: Record<string, number> }>("/v1/jones/prices");
  return pricesRes.prices;
};
export const fetchPair = async (pairAddress: string): Promise<Pair> => {
  const res = await fetchOwn<{ pair: Pair }>(`/v1/pair/${pairAddress}`);
  return res.pair;
};
export const fetchFarmsGeneral = async (): Promise<Farm[]> => {
  const res = await fetchOwn<{ farms: Farm[] }>("/v1/jones/farms/general");
  return res.farms;
};
export const fetchVaultsGeneral = async (): Promise<Vault[]> => {
  const res = await fetchOwn<{ vaults: Vault[] }>("/v1/jones/vaults/general");
  return res.vaults;
};
