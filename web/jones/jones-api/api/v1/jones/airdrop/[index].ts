import type { VercelRequest, VercelResponse } from "@vercel/node";
import { indexClaimed } from "../../../../helpers/airdrop";
import { errorMapping } from "../../../../helpers/errorJson";
import { getProvider } from "../../../../helpers/providers";

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const { index } = req.query;
    const provider = getProvider();

    let claimed = false;
    if (typeof index === "string") {
      claimed = await indexClaimed(Number(index), provider);
    }

    res.setHeader("Cache-Control", "no-cache");
    res.status(200).json({ claimed: claimed });
  } catch (err: any) {
    res.json({
      ...errorMapping["AIRDROP"],
      url: req.url,
    });
  }
};
