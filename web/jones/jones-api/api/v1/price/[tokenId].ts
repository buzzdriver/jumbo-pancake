import { getPrice } from "../../../helpers/price";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { errorMapping } from "../../../helpers/errorJson";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const { tokenId } = req.query;
    if (typeof tokenId !== "string") {
      res.json({
        ...errorMapping["INVALID_ADDRESS"],
        url: req.url,
        message: "tokenId must be a string",
      });
      return;
    }
    const tokenPrice = await getPrice(tokenId);

    res.status(200).json({ price: tokenPrice });
  } catch (err: any) {
    res.json({
      ...errorMapping["PRICE"],
      url: req.url,
    });
  }
}
