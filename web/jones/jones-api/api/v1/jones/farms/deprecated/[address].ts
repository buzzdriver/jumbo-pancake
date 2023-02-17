import type { VercelRequest, VercelResponse } from "@vercel/node";
import { errorMapping } from "../../../../../helpers/errorJson";
import { getProvider } from "../../../../../helpers/providers";
import { getFarmsDeprecated } from "../../../../../helpers/staking";

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const { address } = req.query;
    if (typeof address !== "string") {
      res.json({
        ...errorMapping["INVALID_ADDRESS"],
        url: req.url,
        message: "Address should be a string",
      });
      return;
    }
    const provider = getProvider();
    const deprecatedFarms = await getFarmsDeprecated(provider, address);

    res.setHeader("Cache-Control", "no-cache");
    res.status(200).json({ deprecatedFarms });
  } catch (err: any) {
    res.json({
      ...errorMapping["FARMS"],
      url: req.url,
    });
  }
};
