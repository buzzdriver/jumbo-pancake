import type { VercelRequest, VercelResponse } from "@vercel/node";
import { errorMapping } from "../../../helpers/errorJson";
import { getPair } from "../../../helpers/pair";
import { getProvider } from "../../../helpers/providers";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const { address } = req.query;
  try {
    if (typeof address !== "string") {
      res.json({
        ...errorMapping["INVALID_ADDRESS"],
        url: req.url,
        message: "address is not a string",
      });
      return;
    }

    const provider = getProvider();
    const pair = await getPair(address, provider);

    res.status(200).json({ pair });
  } catch (err: any) {
    res.json({
      ...errorMapping["PAIR"],
      url: req.url,
    });
  }
}
