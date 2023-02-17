import { addresses, MillinerV2__factory, StakingRewards__factory } from "@jones-dao/sdk";
import { parseEther } from "ethers/lib/utils";

import { getWeb3State } from "../utils/helpers";
import { executeWeb3Promise } from "../utils/web3";

export async function stakeToken(poolId: string, stakeAmount: string): Promise<boolean> {
  const { signer } = getWeb3State();
  if (!signer) {
    console.error("No signer found");
    return false;
  }

  const stakingContract = MillinerV2__factory.connect(addresses.MILLINER, signer);
  const stakeAmountWei = parseEther(stakeAmount);
  const stakePromise = stakingContract.deposit(poolId, stakeAmountWei);
  const txSuccess = await executeWeb3Promise(stakePromise);
  return txSuccess;
}

export async function unstakeToken(poolId: string, withdrawAmount: string) {
  const { signer } = getWeb3State();
  if (!signer) {
    console.error("No signer found");
    return false;
  }

  const stakingContract = MillinerV2__factory.connect(addresses.MILLINER, signer);
  const withdrawAmountWei = parseEther(withdrawAmount);
  const unstakePromise = stakingContract.withdraw(poolId, withdrawAmountWei);
  const txSuccess = await executeWeb3Promise(unstakePromise);
  return txSuccess;
}

export const harvest = async (poolId: string): Promise<boolean> => {
  const { signer } = getWeb3State();
  if (!signer) {
    console.error("No signer found");
    return false;
  }

  const stakingContract = MillinerV2__factory.connect(addresses.MILLINER, signer);
  const harvestTx = stakingContract.harvest(poolId);
  const txSuccess = await executeWeb3Promise(harvestTx);
  return txSuccess;
};

export const compound = async (poolId: string): Promise<boolean> => {
  const { signer } = getWeb3State();
  if (!signer) {
    console.error("No signer found");
    return false;
  }

  const stakingContract = MillinerV2__factory.connect(addresses.MILLINER, signer);
  const compoundTx = stakingContract.compound(poolId);
  const txSuccess = await executeWeb3Promise(compoundTx);
  return txSuccess;
};

export async function exitOld(stakingContractAddress: string) {
  const { signer } = getWeb3State();
  if (!signer) {
    console.error("No signer found");
    return false;
  }

  const stakingContract = StakingRewards__factory.connect(stakingContractAddress, signer);
  const unstakePromise = stakingContract.exit();
  const txSuccess = await executeWeb3Promise(unstakePromise);
  return txSuccess;
}

export async function unstakeOld(stakingContractAddress: string, withdrawAmount: string) {
  const { signer } = getWeb3State();
  if (!signer) {
    console.error("No signer found");
    return false;
  }

  const stakingContract = StakingRewards__factory.connect(stakingContractAddress, signer);
  const withdrawAmountWei = parseEther(withdrawAmount);
  const unstakePromise = stakingContract.withdraw(withdrawAmountWei);
  const txSuccess = await executeWeb3Promise(unstakePromise);
  return txSuccess;
}

export async function claimOld(stakingContractAddress: string) {
  const { signer } = getWeb3State();
  if (!signer) {
    console.error("No signer found");
    return false;
  }

  const stakingContract = StakingRewards__factory.connect(stakingContractAddress, signer);
  const claimPromise = stakingContract.getReward();
  const txSuccess = await executeWeb3Promise(claimPromise);
  return txSuccess;
}
