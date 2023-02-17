import { useEffect } from "react";

import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { getDefaultProvider } from "ethers";
import Web3Modal, { connectors } from "web3modal";

import { useStore } from "../store";

import { supportedChains } from "../utils/network";

const web3Modal =
  typeof window !== "undefined"
    ? new Web3Modal({
        cacheProvider: true,
        theme: "dark",
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              rpc: {
                42161: "https://arb1.arbitrum.io/rpc",
              },
            },
          },
          "custom-injected": {
            display: {
              logo: "https://cdn.bitkeep.vip/u_b_69b66a00-a046-11ec-a3eb-f758fa002ae8.png",
              name: "BitKeep",
              description: "Connect with the provider in your Browser",
            },
            package: connectors.injected,
            connector: async (ProviderPackage: any, options: any) => {
              const provider = new ProviderPackage(options);
              return provider;
            },
          },
        },
      })
    : ({} as Web3Modal);

export const useWeb3Modal = () => {
  const {
    web3Data: {
      state: { address: storedAddress },
      actions: { setWeb3Data, setAddress, setEns, resetState },
    },
  } = useStore(({ web3Data }) => ({ web3Data }));

  const disconnect = () => {
    web3Modal.clearCachedProvider();
    resetState();
  };

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }

    provider.on("disconnect", (_code: number, _reason: string) => {
      // wallet connect
      disconnect();
    });
    provider.on("accountsChanged", async (accounts: string[]) => {
      const address = accounts[0];
      const ethProvider = getDefaultProvider();
      const ens = await ethProvider.lookupAddress(address);
      setAddress(accounts[0]);
      setEns(ens);
    });
    provider.on("chainChanged", async (_chainIdHex: string) => {
      // Metamask docs: "We strongly recommend reloading the page on chain changes, unless you have good reason not to."
      window.location.reload();
    });
  };

  const connect = async () => {
    const instance = await web3Modal.connect();
    await subscribeProvider(instance);

    const chainId = +instance.chainId;
    const isSupportedChain = !!supportedChains[chainId];

    const signer = new Web3Provider(instance).getSigner();
    const address = await signer.getAddress();

    const ethProvider = getDefaultProvider();
    const ens = await ethProvider.lookupAddress(address);

    if (storedAddress !== address) {
      setWeb3Data({
        signer,
        address,
        ens,
        chainId,
        isSupportedChain,
      });
    }
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      const reconnect = async () => {
        await connect();
      };
      reconnect();
    }
  }, []);

  return { connect, disconnect };
};
