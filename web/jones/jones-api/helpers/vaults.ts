import { formatEther } from "ethers/lib/utils";

import { BaseProvider } from "@ethersproject/providers";
import {
  addresses,
  coingeckoIds,
  ERC20__factory,
  IDPXSingleStaking__factory,
  JonesERC20VaultV3__factory,
  MaxUint256,
  removeDecimals,
  removeDecimalsCallback,
  Vault,
  VaultGeneral,
  VaultName,
  vaults,
  VaultState,
  VaultStatic,
  VaultVersion,
  WeiPerEther,
} from "@jones-dao/sdk";

import { fetchPrice } from "./utils";

export const getVaultsGeneral = async (provider: BaseProvider) =>
  Promise.all(vaults.map(async (vault) => fetchGeneralVaultData[vault.version](provider, vault)));

export const getVaultsPersonal = async (provider: BaseProvider, address: string) =>
  Promise.all(
    vaults.map(async (vault) => fetchPersonalVaultData[vault.version](provider, vault, address)),
  );

const fetchGeneralVaultDataV3 = async (
  provider: BaseProvider,
  vault: VaultStatic,
): Promise<Vault> => {
  const { tokenAddress, vaultAddress } = vault;
  const coingeckoId = coingeckoIds[vault.tokenAddress];

  const vaultContract = JonesERC20VaultV3__factory.connect(vaultAddress, provider);

  try {
    const promises = Promise.all([
      vaultContract.state(),
      vaultContract.vaultCap(),
      fetchPrice(coingeckoId),
    ]);
    const numberPromises = Promise.all([
      vaultContract.convertToShares(WeiPerEther),
      vaultContract.convertToAssets(WeiPerEther),
      vaultContract.snapshotAssetBalance(),
    ]);

    const [vaultState, vaultCapBN, tokenPrice] = await promises;
    const [jAssetPerToken, tokenPerJAsset, snapshotVaultBalance] = (await numberPromises.then(
      removeDecimalsCallback,
    )) as [number, number, number];
    const managementWindowOpen = vaultState !== VaultState.UNMANAGED;

    const vaultCap = removeDecimals(vaultCapBN);
    const isCapSet = vaultCap > 0 && !MaxUint256.eq(vaultCapBN);

    const totalDeposited = managementWindowOpen
      ? snapshotVaultBalance
      : await getVaultDeposits(vaultAddress, tokenAddress, provider);

    const percentageFilled = isCapSet ? (totalDeposited / vaultCap) * 100 : 0;

    const tvl = totalDeposited * tokenPrice;

    const vaultInfo: Vault = {
      ...vault,
      isCapSet,
      managementWindowOpen,
      vaultCap,
      tvl,
      totalDeposited,
      percentageFilled,
      jAssetPerToken,
      tokenPerJAsset,
    };

    return vaultInfo;
  } catch (err) {
    console.error(err);

    return { ...vault, ...vaultPlaceholderValues };
  }
};

const fetchPersonalVaultDataV3 = async (
  provider: BaseProvider,
  vault: VaultStatic,
  address: string,
): Promise<Vault> => {
  let userClaimable = "0.0";
  try {
    const contract = JonesERC20VaultV3__factory.connect(vault.vaultAddress, provider);
    userClaimable = formatEther(await contract.maxWithdraw(address));
  } catch (err) {
    console.error(err);
  } finally {
    return { ...vault, ...vaultPlaceholderValues, userClaimable };
  }
};

const vaultPlaceholderValues: VaultGeneral = {
  isCapSet: false,
  managementWindowOpen: false,
  vaultCap: 0,
  tvl: 0,
  totalDeposited: 0,
  percentageFilled: 0,
  jAssetPerToken: 1,
  tokenPerJAsset: 1,
};

const getVaultDeposits = async (
  vaultAddress: string,
  tokenAddress: string,
  provider: BaseProvider,
) => {
  const erc20Contract = ERC20__factory.connect(tokenAddress, provider);
  const [vaultBalance, decimals] = await Promise.all([
    erc20Contract.balanceOf(vaultAddress),
    erc20Contract.decimals(),
  ]);

  let totalDepositedBN = vaultBalance;

  if (vaultAddress === addresses.vaults[VaultName.DPX]) {
    const dpxSingleStakeContract = IDPXSingleStaking__factory.connect(
      addresses.thirdParty.DPX_SS,
      provider,
    );
    const dpxSingleStakeBalance = await dpxSingleStakeContract.balanceOf(vaultAddress);

    totalDepositedBN = totalDepositedBN.add(dpxSingleStakeBalance);
  }

  return removeDecimals(totalDepositedBN, decimals);
};

export const fetchGeneralVaultData = {
  [VaultVersion.V3]: fetchGeneralVaultDataV3,
};

export const fetchPersonalVaultData = {
  [VaultVersion.V3]: fetchPersonalVaultDataV3,
};
