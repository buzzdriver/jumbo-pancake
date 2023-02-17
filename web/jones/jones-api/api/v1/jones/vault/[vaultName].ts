import { vaults } from "@jones-dao/sdk";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { errorMapping } from "../../../../helpers/errorJson";
import { getProvider } from "../../../../helpers/providers";
import { fetchGeneralVaultData, fetchPersonalVaultData } from "../../../../helpers/vaults";

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const { vaultName, address } = req.query;
    if (typeof vaultName !== "string") {
      res.json({
        ...errorMapping["INVALID_ADDRESS"],
        url: req.url,
        message: "vaultName should be a string",
      });
      return;
    }

    const vault = vaults.find((v) => v.vaultName.toLowerCase() === vaultName.toLowerCase());
    if (!vault) throw new Error("Vault not found");

    const provider = getProvider();
    const general = await fetchGeneralVaultData[vault.version](provider, vault);
    const personal =
      typeof address === "string"
        ? await fetchPersonalVaultData[vault.version](provider, vault, address)
        : { userClaimable: "0.0" };

    res.setHeader("Cache-Control", "no-cache");
    res.status(200).json({ vault: { ...general, ...personal } });
  } catch (err: any) {
    res.json({
      ...errorMapping["VAULT"],
      url: req.url,
    });
  }
};
