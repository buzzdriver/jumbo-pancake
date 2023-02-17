import { BaseProvider } from "@ethersproject/providers";
import { addresses, JonesAirdrop__factory } from "@jones-dao/sdk";

export async function indexClaimed(index: number, provider: BaseProvider): Promise<boolean> {
  /**
   * Function to check if index has already claimed
   */
  try {
    const airdropContract = JonesAirdrop__factory.connect(addresses.AIRDROP, provider);
    const indexClaimed = await airdropContract.isClaimed(index);

    return indexClaimed;
  } catch (error) {
    console.error(error);
    return false;
  }
}
