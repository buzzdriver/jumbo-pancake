import { addresses, JonesAirdrop__factory } from "@jones-dao/sdk";

import { getWeb3State } from "../utils/helpers";
import { executeWeb3Promise } from "../utils/web3";

const airdropContractAddress = addresses.AIRDROP;

export async function claimToken(
  claimAmount: string,
  claimAddress: string,
  index: number,
  merkleProof: string[],
): Promise<boolean> {
  /**
   * Function to claim Jones token for the airdrop
   */

  const { signer } = getWeb3State();
  if (!signer) {
    console.error("No signer found");
    return false;
  }

  const airdropContract = JonesAirdrop__factory.connect(airdropContractAddress, signer);
  const claimPromise = airdropContract.claim(index, claimAddress, claimAmount, merkleProof);
  const txSuccess = await executeWeb3Promise(claimPromise);
  return txSuccess;
}
