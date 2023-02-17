import { FC, useEffect, useState } from "react";

import { Box, SimpleGrid, Stack } from "@chakra-ui/react";
import { VaultName } from "@jones-dao/sdk";
import { useRouter } from "next/router";

import Disclaimer from "../../common/components/Disclaimer";
import { Image } from "../../common/components/Image";
import Layout from "../../common/components/Layout";
import { PageTitleToken } from "../../common/components/PageTitle";
import {
  VaultDetails,
  VaultInteraction,
  VaultsFooter,
  VaultStakingSection,
  VaultStatus,
  VaultTabs,
} from "../../common/components/Vaults";
import PerformanceGraph from "../../common/components/Vaults/PerformanceGraph";
import config from "../../common/config";
import { VaultContext } from "../../common/context";
import { useStore } from "../../common/store";

export enum Tab {
  VAULT = "vault",
  ANALYTICS = "analytics",
}

const VaultPage: FC = () => {
  const [tab, setTab] = useState(Tab.VAULT);
  const router = useRouter();
  const { token } = router.query as { token: string };

  const {
    web3Data: {
      state: { address },
    },
    vaults: {
      state: { vaults, loading, userDataLoading },
      actions: { getVaultsGeneral, getVaultsPersonal },
    },
  } = useStore();

  const vault = vaults.find(({ vaultName }) => vaultName === token);

  useEffect(() => {
    if (!vault && router.isReady) {
      getVaultsGeneral();
    }
  }, [getVaultsGeneral, router.isReady, vault]);

  useEffect(() => {
    if (address && vault && !vault.userClaimable) {
      getVaultsPersonal();
    }
  }, [address, getVaultsPersonal, vault]);

  if (!router.isReady) return null;
  const vaultData = config.vaultData[token as VaultName];

  const vaultRoiLs: { month: string; value: number }[] = [];
  Object.entries(vaultData.roi).forEach(([key, value]) => {
    if (key === "guardedLaunch") {
      vaultRoiLs.push({ month: "Jan 22", value: Number(value) });
    } else {
      vaultRoiLs.push({ month: key, value: Number(value) });
    }
  });

  return (
    <Box bg="#171717">
      <Layout title={`${token} Vault`}>
        <Box position="absolute" right={0} display={{ base: "none", md: "block" }}>
          <Image
            width={400}
            height={400}
            src={`/vaults/details/${token.toLowerCase()}.svg`}
            alt="background-image"
          />
        </Box>

        <PageTitleToken
          mt={9}
          tokenImgSrc={`/logo/${token.toLowerCase()}.svg`}
          title={`${token} Vault`}
          backRoute="/vaults"
        />
        <Stack spacing={6} mt={8}>
          <VaultContext.Provider value={{ ...vault, loading, userDataLoading }}>
            <VaultStatus />
            <Box display={{ base: "none", sm: "block" }}>
              <VaultTabs tab={tab} setTab={setTab} />
            </Box>
            {tab === Tab.VAULT ? (
              <>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <VaultDetails />
                  <VaultInteraction />
                </SimpleGrid>

                <VaultStakingSection />
              </>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <PerformanceGraph
                  toolTipText={`${token} Vault `}
                  isMonthlyReturn={true}
                  data={vaultRoiLs}
                  title={"Monthly Return"}
                  xaxisLabel={"Singular month vault ROI"}
                  referenceLineVal={0}
                />
              </SimpleGrid>
            )}
          </VaultContext.Provider>
          {tab === Tab.VAULT && (
            <>
              <VaultsFooter vaultName={token} />
            </>
          )}
          <Disclaimer />
        </Stack>
      </Layout>

      <Box display={{ base: "block", sm: "none" }} position="sticky" bottom={0} bg="#171717">
        <VaultTabs tab={tab} setTab={setTab} />
      </Box>
    </Box>
  );
};

export default VaultPage;
