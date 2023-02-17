import { providers as ethersProviders } from "ethers";

import { providers as multicallProviders } from "@0xsequence/multicall";
import { BaseProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { ChainId } from "@jones-dao/sdk";

import { supportedChains } from "./constants";

const getRpcUri = (chainId: number): string | undefined => {
  if (chainId in ChainId) return supportedChains[chainId as ChainId].rpcUri;
  else console.error("ChainId missing or not supported");
  return;
};

export const getProvider = (chainId = ChainId.ARBITRUM): BaseProvider => {
  const rpcUri = getRpcUri(chainId);
  if (rpcUri) {
    return new multicallProviders.MulticallProvider(new StaticJsonRpcProvider(rpcUri));
  }
  return new multicallProviders.MulticallProvider(ethersProviders.getDefaultProvider());
};
