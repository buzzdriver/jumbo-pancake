import { addresses, ChainId, TokenName } from "@jones-dao/sdk";

type Chains = {
  [key in ChainId | number]: ChainData;
};

interface AssetData {
  symbol: string;
  name: string;
  decimals: number;
  contractAddress: string;
}

interface ChainData {
  name: string;
  chainId: number;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  icon: string;
  nativeCurrency: AssetData;
}

export const chainIds = Object.values(ChainId).filter(Number) as ChainId[];
export const displayChainIds = chainIds.filter((v) => v !== ChainId.HARDHAT) as ChainId[];

export const supportedChains: Chains = {
  [ChainId.ARBITRUM]: {
    name: "Arbitrum",
    chainId: 42161,
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io/"],
    icon: "arbitrum-dark",
    nativeCurrency: {
      symbol: "AETH",
      name: "Ethereum",
      decimals: 18,
      contractAddress: "",
    },
  },
  [ChainId.HARDHAT]: {
    name: "Hardhat local node",
    chainId: 1337,
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io/"],
    icon: "arbitrum-dark",
    nativeCurrency: {
      symbol: "AETH",
      name: "Ethereum",
      decimals: 18,
      contractAddress: "",
    },
  },
};

export const switchNetwork = async (chainId: number) => {
  try {
    const chainIdHex = idToHexString(chainId);
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (e: any) {
    // If the chain has not been added to the user's wallet
    // On mobile, error code 4902 is part of the error message. A fix is in the works, this is a temp fix
    if (JSON.stringify(e).includes("4902")) {
      const chain = supportedChains[chainId];
      if (!chain) return;
      const params = [
        {
          chainId: idToHexString(chain.chainId),
          chainName: chain.name,
          nativeCurrency: chain.nativeCurrency,
          rpcUrls: chain.rpcUrls,
          blockExplorerUrls: chain.blockExplorerUrls,
        },
      ];
      try {
        await window.ethereum.request({ method: "wallet_addEthereumChain", params });
      } catch (e) {
        console.log(e);
      }
    }
  }
};

export const idToHexString = (id: number) => {
  return "0x" + id.toString(16);
};

export const idFromHexString = (hexString: string) => {
  return parseInt(hexString, 16);
};

export const addTokenToWallet = async (
  address: string,
  symbol: string,
  image?: string,
  decimals = 18,
) => {
  try {
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address,
          symbol,
          decimals,
          image,
        },
      },
    });
  } catch (err) {
    console.error(err);
  }
};

export const addJonesToken = async () =>
  await addTokenToWallet(
    addresses.tokens[TokenName.JONES],
    "JONES",
    "https://www.gitbook.com/cdn-cgi/image/height=40,fit=contain,dpr=2,format=auto/https%3A%2F%2F2384262168-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fm6Ih8ks8ypfDyOM12liG%252Flogo%252FlAFKoaiYE1CC5zHQRtY6%252Fjones-hat-dark.png%3Falt%3Dmedia%26token%3D26c34be6-1170-41cf-b6e1-14ec95c57d0c",
    18,
  );
