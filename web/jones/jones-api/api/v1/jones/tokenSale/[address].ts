import type { VercelRequest, VercelResponse } from "@vercel/node";
import { errorMapping } from "../../../../helpers/errorJson";
import { getProvider } from "../../../../helpers/providers";
import { userAlreadyClaimed } from "../../../../helpers/tokenSale";

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const { address } = req.query;
    const provider = getProvider();

    let userClaimed = true;
    let userEthClaimable = 0;
    let userJonesClaimable = 0;
    if (typeof address === "string") {
      ({ userEthClaimable, userJonesClaimable, userClaimed } = await userAlreadyClaimed(
        address,
        provider,
      ));
    }

    res.setHeader("Cache-Control", "no-cache");
    res.status(200).json({
      userEthClaimable: userEthClaimable,
      userJonesClaimable: userJonesClaimable,
      userClaimed: userClaimed,
    });
  } catch (err: any) {
    res.json({
      ...errorMapping["TOKENSALE"],
      url: req.url,
    });
  }
};
