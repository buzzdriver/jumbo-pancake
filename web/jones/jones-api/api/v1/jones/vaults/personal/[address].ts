import type { VercelRequest, VercelResponse } from "@vercel/node";
import { errorMapping } from "../../../../../helpers/errorJson";
import { getProvider } from "../../../../../helpers/providers";
import { getVaultsPersonal } from "../../../../../helpers/vaults";

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const { address } = req.query;
  try {
    if (typeof address !== "string") {
      res.json({
        ...errorMapping["INVALID_ADDRESS"],
        url: req.url,
        message: "address should be a string",
      });
      return;
    }
    const provider = getProvider();
    const vaults = await getVaultsPersonal(provider, address);

    res.setHeader("Cache-Control", "no-cache");
    res.status(200).json({ vaults });
  } catch (err: any) {
    res.json({
      ...errorMapping["VAULTS"],
      url: req.url,
    });
  }
};
