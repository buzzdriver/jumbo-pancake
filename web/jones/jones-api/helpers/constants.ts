import { ChainId } from "@jones-dao/sdk";

export interface Chain {
  name: string;
  rpcUri: string;
}

const alchemyProjectId = process.env["ALCHEMY_PROJECT_ID"];

export const supportedChains: Record<ChainId, Chain> = {
  [ChainId.ARBITRUM]: {
    name: "Arbitrum",
    rpcUri: `https://arb-mainnet.g.alchemy.com/v2/${alchemyProjectId}`,
  },
  [ChainId.HARDHAT]: {
    name: "Hardhat local node",
    rpcUri: "http://localhost:8545",
  },
};
