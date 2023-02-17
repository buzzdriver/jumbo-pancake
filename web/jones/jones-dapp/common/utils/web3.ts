import { createStandaloneToast } from "@chakra-ui/react";
import { ERC20__factory, MaxUint256 } from "@jones-dao/sdk";
import { BigNumberish, ContractTransaction } from "ethers";
import { parseEther } from "ethers/lib/utils";

import { getToastConfig, ToastStatus } from "../components/Toast";
import config from "../config";
import { theme } from "../theme";
import { findObjectValue, getWeb3State } from "./helpers";
import { fetchUrl } from "./queries";

export const getTokenBalance = async (tokenAddress: string, address: string): Promise<string> => {
  const { balance } = await fetchUrl<{ balance: string }>(
    `${config.apiUrl}/v1/balance/${tokenAddress}?address=${address}`,
  );

  return balance;
};

export const getEthBalance = async (address: string): Promise<string> => {
  const { balance } = await fetchUrl<{ balance: string }>(
    `${config.apiUrl}/v1/balance/eth?address=${address}`,
  );

  return balance;
};

export const getAllowance = async (
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string,
): Promise<number> => {
  const { allowance } = await fetchUrl<{ allowance: string }>(
    `${config.apiUrl}/v1/allowance/${tokenAddress}?ownerAddress=${ownerAddress}&spenderAddress=${spenderAddress}`,
  );

  return +allowance;
};

export const approveToken = async (
  tokenAddress: string,
  spenderAddress: string,
  amount?: BigNumberish,
): Promise<boolean> => {
  const { signer } = getWeb3State();

  if (!signer) {
    console.error("No signer found");
    return false;
  }
  const tokenContract = ERC20__factory.connect(tokenAddress, signer);
  const approveAmount = amount ? parseEther(amount.toString()) : MaxUint256;
  const approvalPromise = tokenContract.approve(spenderAddress, approveAmount);
  const txSuccess = await executeWeb3Promise(approvalPromise);
  return txSuccess;
};

export const executeWeb3Promise = async (
  method: Promise<ContractTransaction>,
): Promise<boolean> => {
  const toast = createStandaloneToast({ theme });
  const timestampId = new Date().getTime();
  const closeToast = () => toast.close(timestampId);

  try {
    const tx = await method;

    const pendingToastConfig = getToastConfig(
      timestampId,
      {
        toastStatus: ToastStatus.PENDING,
        closeToast,
        title: "Pending",
        txHash: tx.hash,
      },
      false,
    );

    toast(pendingToastConfig);
    await tx.wait();

    const confirmedToastConfig = getToastConfig(
      timestampId,
      {
        toastStatus: ToastStatus.CONFIRMED,
        closeToast,
        title: "Confirmed",
        txHash: tx.hash,
      },
      true,
    );

    toast.update(timestampId, confirmedToastConfig);

    return true;
  } catch (err: any) {
    let errorMessage = err.message;

    const nestedError = err.message.match("'(.*)'");
    if (nestedError) {
      let errorObj = nestedError[0];
      errorObj = JSON.parse(errorObj.replace(/[']+/g, ""));
      const msgArray: any[] = [];
      findObjectValue(errorObj, "message", msgArray);
      if (msgArray.length > 0) {
        errorMessage = msgArray[0];
      }
    }

    const errorToastConfig = getToastConfig(
      timestampId,
      {
        toastStatus: ToastStatus.ERROR,
        closeToast,
        title: "Error",
        description: errorMessage,
      },
      true,
    );

    toast(errorToastConfig);
    return false;
  }
};
