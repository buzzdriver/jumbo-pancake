import type { VercelRequest, VercelResponse } from "@vercel/node";
import { errorMapping } from "../../../../helpers/errorJson";
import { getProvider } from "../../../../helpers/providers";
import { fetchSingleFarm } from "../../../../helpers/staking";

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const { poolId, address } = req.query;

    if (typeof poolId !== "string") {
      res.json({
        ...errorMapping["INVALID_ADDRESS"],
        url: req.url,
        message: "poolId should be a string",
      });
      return;
    }

    const provider = getProvider();
    const farm = await fetchSingleFarm(
      provider,
      typeof address === "string" ? address : undefined,
      poolId,
    );

    res.setHeader("Cache-Control", "no-cache");
    res.status(200).json({ farm });
  } catch (err: any) {
    res.json({
      ...errorMapping["FARM"],
      url: req.url,
    });
  }
};
