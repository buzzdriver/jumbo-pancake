import { BaseProvider } from "@ethersproject/providers";
import {
  addresses,
  JonesSaleClaim__factory,
  JonesTokenSaleV3__factory,
  removeDecimalsCallback,
} from "@jones-dao/sdk";

export async function userAlreadyClaimed(
  address: string,
  provider: BaseProvider,
): Promise<{
  userEthClaimable: number;
  userJonesClaimable: number;
  userClaimed: boolean;
}> {
  const claimContract = JonesSaleClaim__factory.connect(addresses.PUBLIC_SALE_CLAIM, provider);
  const saleContract = JonesTokenSaleV3__factory.connect(addresses.PUBLIC_SALE, provider);

  const [userEthClaimable, userJonesClaimable] = (await Promise.all([
    saleContract.claimAmountEth(address),
    saleContract.claimAmountJones(address),
  ]).then(removeDecimalsCallback)) as [number, number];

  const userClaimed = await claimContract.claims(address);

  return {
    userEthClaimable,
    userJonesClaimable,
    userClaimed: userClaimed.eq(1),
  };
}
