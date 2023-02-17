import { getMarketPrices, getPrices } from "../../../helpers/price";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { errorMapping } from "../../../helpers/errorJson";

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const { tokenIds } = req.query;

    const prices = tokenIds ? await getPrices(tokenIds) : await getMarketPrices();

    res.status(200).json({ prices });
  } catch (err: any) {
    res.json({
      ...errorMapping["PRICES"],
      url: req.url,
    });
  }
};
