import type { VercelRequest, VercelResponse } from "@vercel/node";
import { errorMapping } from "../../../../helpers/errorJson";
import { getProvider } from "../../../../helpers/providers";
import { getVaultsGeneral } from "../../../../helpers/vaults";

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const provider = getProvider();
    const vaults = await getVaultsGeneral(provider);

    res.status(200).json({ vaults });
  } catch (err: any) {
    res.json({
      ...errorMapping["VAULTS"],
      url: req.url,
    });
  }
};
