import type { VercelRequest, VercelResponse } from "@vercel/node";
import { errorMapping } from "../../../helpers/errorJson";
import { getJonesCirculatingSupply } from "../../../helpers/supply";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const jonesCirculatingSupply = await getJonesCirculatingSupply();
    res.status(200).json({
      totalSupply: 10_000_000,
      maxSupply: 10_000_000,
      circulatingSupply: jonesCirculatingSupply,
    });
  } catch (err: any) {
    res.json({
      ...errorMapping["SUPPLY"],
      url: req.url,
    });
  }
}
