import {
  addresses,
  JonesERC20VaultV3__factory,
  JonesWETHVaultV3Adapter__factory,
  VaultName,
  VaultVersion,
} from "@jones-dao/sdk";
import { Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";

import { executeWeb3Promise } from "../utils/web3";

const depositTokensV3 = async (
  amount: string,
  vaultAddress: string,
  signer: Signer,
): Promise<boolean> => {
  const address = await signer.getAddress();
  const isEth = vaultAddress === addresses.vaults[VaultName.ETH];
  const amountFormatted = parseEther(amount);

  let tx;
  if (isEth) {
    const vaultContract = JonesWETHVaultV3Adapter__factory.connect(
      addresses.WETH_VAULT_ADAPTER,
      signer,
    );
    tx = vaultContract.deposit(address, { value: amountFormatted });
  } else {
    const vaultContract = JonesERC20VaultV3__factory.connect(vaultAddress, signer);
    tx = vaultContract.deposit(amountFormatted, address);
  }

  const txSuccess = await executeWeb3Promise(tx);
  return txSuccess;
};

const claimTokensV3 = async (
  amount: string,
  vaultAddress: string,
  signer: Signer,
): Promise<boolean> => {
  const isEth = vaultAddress === addresses.vaults[VaultName.ETH];
  const address = await signer.getAddress();
  const amountFormatted = parseEther(amount);

  let tx;
  if (isEth) {
    const vaultContract = JonesWETHVaultV3Adapter__factory.connect(
      addresses.WETH_VAULT_ADAPTER,
      signer,
    );
    tx = vaultContract.redeem(amountFormatted, address);
  } else {
    const vaultContract = JonesERC20VaultV3__factory.connect(vaultAddress, signer);
    tx = vaultContract.redeem(amountFormatted, address, address);
  }

  const txSuccess = await executeWeb3Promise(tx);
  return txSuccess;
};

export const depositTokens = {
  [VaultVersion.V3]: depositTokensV3,
};

export const claimTokens = {
  [VaultVersion.V3]: claimTokensV3,
};
