import { addresses, JonesSaleClaim__factory } from "@jones-dao/sdk";

import { getWeb3State } from "../utils/helpers";
import { executeWeb3Promise } from "../utils/web3";

export async function withdrawTokens(address: string): Promise<boolean> {
  /**
   * Function to allow user to withdraw tokens after sale has ended.
   */

  const { signer } = getWeb3State();
  if (!signer) {
    console.error("No signer found");
    return false;
  }

  const claimContract = JonesSaleClaim__factory.connect(addresses.PUBLIC_SALE_CLAIM, signer);
  const withdrawTokensPromise = claimContract.claim(address);
  const txSuccess = await executeWeb3Promise(withdrawTokensPromise);
  return txSuccess;
}
