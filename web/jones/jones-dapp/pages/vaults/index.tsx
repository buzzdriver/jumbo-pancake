import { useEffect } from "react";

import { Box, Center, Flex, SimpleGrid, Stack } from "@chakra-ui/react";
import { vaults as vaultsStatic } from "@jones-dao/sdk";

import { VaultAutoRollingBadge } from "../../common/components/Badge/VaultAutoRollingBadge";
import Disclaimer from "../../common/components/Disclaimer";
import Layout from "../../common/components/Layout";
import { PageTitle } from "../../common/components/PageTitle";
import { StyledSkeleton, StyledSkeletonText } from "../../common/components/Styled/StyledSkeleton";
import { Tvl } from "../../common/components/Tvl";
import { VaultOverview, VaultsFooter } from "../../common/components/Vaults";
import VaultOverviewCard from "../../common/components/Vaults/VaultOverviewCard";
import { VaultYieldGraph } from "../../common/components/Vaults/VaultYieldGraph";
import { useStore } from "../../common/store";

function Vaults() {
  const {
    vaults: {
      state: { loading, vaults, vaultsTvl },
      actions: { getVaultsGeneral },
    },
    marketPrices,
  } = useStore();

  useEffect(() => {
    if (marketPrices.state.timestampLast && !vaults.length) getVaultsGeneral();
  }, [getVaultsGeneral, marketPrices.state.timestampLast, vaults.length]);

  return (
    <Layout title="Vaults">
      <PageTitle
        title="Vaults"
        subtitle="Generate yield with an actively managed and hedged options spread"
      />
      <Stack spacing={8}>
        <Tvl tvl={vaultsTvl} rightIcon={<VaultAutoRollingBadge />} />
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
          {loading || !vaults.length
            ? Array.from({ length: vaultsStatic.length }, (_, i) => i).map((v) => (
                <VaultSkeleton key={v} />
              ))
            : vaults.map((vault) => <VaultOverview key={vault.vaultAddress} {...vault} />)}
        </SimpleGrid>
        <VaultYieldGraph />
        <VaultsFooter />
        <Disclaimer />
      </Stack>
    </Layout>
  );
}

export default Vaults;

const VaultSkeleton = () => (
  <VaultOverviewCard>
    <Center h="64px" w="full">
      <StyledSkeleton height={8} width="40%" />
    </Center>
    <Flex h={{ base: "auto", md: "255px" }} w="full" direction="column" alignItems="center">
      <StyledSkeleton height={8} width="70%" />
      <StyledSkeleton height={2} width="60%" mt={2} />
      <StyledSkeletonText noOfLines={4} spacing="4" width="80%" mt={8} />
    </Flex>
    <StyledSkeleton height={12} width="80%" rounded="2xl" display={{ base: "none", md: "block" }} />
  </VaultOverviewCard>
);
