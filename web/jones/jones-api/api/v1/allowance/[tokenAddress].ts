import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAllowance } from "../../../helpers/erc20";
import { errorMapping } from "../../../helpers/errorJson";
import { getProvider } from "../../../helpers/providers";

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const { tokenAddress, ownerAddress, spenderAddress } = req.query;

    if (
      typeof tokenAddress !== "string" ||
      typeof ownerAddress !== "string" ||
      typeof spenderAddress !== "string"
    ) {
      res.json({
        ...errorMapping["INVALID_ADDRESS"],
        url: req.url,
        message: "tokenAddress, ownerAddress, spenderAddress should be strings",
      });
      return;
    }

    const provider = getProvider();
    const allowance = await getAllowance(tokenAddress, ownerAddress, spenderAddress, provider);
    res.setHeader("Cache-Control", "no-cache").status(200).json({ allowance });
  } catch (err: any) {
    res.json({
      ...errorMapping["ALLOWANCE"],
      url: req.url,
    });
  }
};
