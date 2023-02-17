import type { VercelRequest, VercelResponse } from "@vercel/node";
import { errorMapping } from "../../../helpers/errorJson";
import { getProvider } from "../../../helpers/providers";
import { getFarmsV1Tvl } from "../../../helpers/staking";
import { fetchFarmsGeneral, fetchVaultsGeneral } from "../../../helpers/utils";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const provider = getProvider();

    const [farmsV1Tvl, farms, vaults] = await Promise.all([
      getFarmsV1Tvl(provider),
      fetchFarmsGeneral(),
      fetchVaultsGeneral(),
    ]);

    const farmsV2Tvl = farms.reduce((acc, curr) => acc + curr.totalStakedValue, 0);
    const vaultsTvl = vaults.reduce((acc, curr) => acc + curr.tvl, 0);
    const farmsTotalTvl = farmsV1Tvl + farmsV2Tvl;
    const totalTVL = farmsTotalTvl + vaultsTvl;

    res.status(200).json({
      tvl: {
        staking: farmsTotalTvl,
        vaults: vaultsTvl,
        total: totalTVL,
      },
    });
  } catch (err: any) {
    res.json({
      ...errorMapping["TVL"],
      url: req.url,
    });
  }
}
