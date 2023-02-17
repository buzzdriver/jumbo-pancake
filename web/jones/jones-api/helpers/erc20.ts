import { formatEther } from "ethers/lib/utils";

import { BaseProvider } from "@ethersproject/providers";
import { ERC20__factory } from "@jones-dao/sdk";

export const getTokenBalance = async (
  tokenAddress: string,
  address: string,
  provider: BaseProvider,
): Promise<string> => {
  const contract = ERC20__factory.connect(tokenAddress, provider);
  const balance = await contract.balanceOf(address);
  return formatEther(balance);
};

export const getEthBalance = async (address: string, provider: BaseProvider): Promise<string> => {
  const balance = await provider.getBalance(address);
  return formatEther(balance);
};

export const getAllowance = async (
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string,
  provider: BaseProvider,
): Promise<string> => {
  const contract = ERC20__factory.connect(tokenAddress, provider);
  const allowance = await contract.allowance(ownerAddress, spenderAddress);
  return formatEther(allowance);
};
