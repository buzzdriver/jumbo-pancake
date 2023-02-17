import { VaultName } from "@jones-dao/sdk";

import devConfig from "./development";
import prodConfig from "./production";
import stagingConfig from "./staging";

type VaultData = Record<
  VaultName,
  {
    roi: { [month: string]: number };
    maxDrawdown: number | undefined;
    unlockDate: string;
    lockDate: string;
  }
>;
interface Config {
  env: string;
  apiUrl: string;
  termsConditionsVersion: string;
  vaultData: VaultData;
}

const hostname = typeof window !== "undefined" && window.location.hostname;

let envConfig;
if (hostname === "localhost") {
  envConfig = devConfig;
} else if (
  hostname === "jones-dapp-staging.vercel.app" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
) {
  envConfig = stagingConfig;
} else {
  envConfig = prodConfig;
}

// Vault (un)lock dates for all vaults, unless specified differently
const unlockDate = "08/26/22"; // MM/DD/YY
const lockDate = "07/31/22"; // MM/DD/YY

const vaultData: VaultData = {
  [VaultName.ETH]: {
    roi: {
      guardedLaunch: 0.912,
      feb22: 0.75,
      mar22: 0.11,
      apr22: 0.473036,
      may22: 1.0882,
      jun22: 1.81279,
    },
    maxDrawdown: undefined,
    lockDate,
    unlockDate,
  },
  [VaultName.GOHM]: {
    roi: {
      feb22: 0.091,
      mar22: -0.05,
      apr22: -0.106037,
      may22: 0,
      jun22: 0,
    },
    maxDrawdown: undefined,
    lockDate,
    unlockDate,
  },
  [VaultName.DPX]: {
    roi: {
      mar22: -0.93,
      apr22: 1.51635,
      may22: 1.577,
      jun22: 2.6855,
    },
    maxDrawdown: undefined,
    lockDate,
    unlockDate,
  },
  [VaultName.RDPX]: {
    roi: {
      may22: 0.9770906,
      jun22: -0.24,
    },
    maxDrawdown: undefined,
    lockDate,
    unlockDate,
  },
};

const config: Config = {
  ...envConfig,
  vaultData,
  termsConditionsVersion: "USER_ACCEPTED_TERMS_V1",
};

export default config;
