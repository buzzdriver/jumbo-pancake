import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getEthBalance, getTokenBalance } from "../../../helpers/erc20";
import { errorMapping } from "../../../helpers/errorJson";
import { getProvider } from "../../../helpers/providers";

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const { tokenAddress, address } = req.query;

    if (typeof tokenAddress !== "string" || typeof address !== "string") {
      res.json({
        ...errorMapping["INVALID_ADDRESS"],
        url: req.url,
        message: "tokenAddress, address should be strings",
      });
      return;
    }

    const provider = getProvider();
    const balance =
      tokenAddress.toLowerCase() === "eth"
        ? await getEthBalance(address, provider)
        : await getTokenBalance(tokenAddress, address, provider);

    res.setHeader("Cache-Control", "no-cache").status(200).json({ balance });
  } catch (err: any) {
    res.json({
      ...errorMapping["BALANCE"],
      url: req.url,
    });
  }
};
