import type { VercelRequest, VercelResponse } from "@vercel/node";
import { errorMapping } from "../../../../helpers/errorJson";
import { getProvider } from "../../../../helpers/providers";
import { getFarmsGeneral } from "../../../../helpers/staking";

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const provider = getProvider();
    const farms = await getFarmsGeneral(provider);

    res.status(200).json({ farms });
  } catch (err: any) {
    res.json({
      ...errorMapping["FARMS"],
      url: req.url,
    });
  }
};
