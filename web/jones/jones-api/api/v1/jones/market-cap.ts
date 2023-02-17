import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getJonesCirculatingSupply } from "../../../helpers/supply";
import { getPrice } from "../../../helpers/price";
import { errorMapping } from "../../../helpers/errorJson";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const [jonesPrice, jonesCirculatingSupply] = await Promise.all([
      getPrice("jones-dao"),
      getJonesCirculatingSupply(),
    ]);
    const marketCap = (jonesPrice?.usd ?? 0) * jonesCirculatingSupply;
    res.status(200).json({ marketCap });
  } catch (err: any) {
    res.json({
      ...errorMapping["MARKETCAP"],
      url: req.url,
    });
  }
}
